type ZodIssue = {
    code: string;
    message: string;
    path: string;
};

class ZodError extends Error {
    constructor(public issues: ZodIssue[]) {
        super();
    }
}

type Infer<T extends BaseSchema> = T['__value'];

type SaveResult<T> = { success: true; data: T } | { success: false; error: ZodError };

type BaseSchema<Type extends string = string, T = unknown> = {
    type: Type;
    safeParse: (value: unknown) => SaveResult<T>;
    optional: () => OptionalSchema<T>;
    array: () => ArraySchema<T>;
    __value: T;
};

type OptionalSchema<T> = BaseSchema<'optional', T | undefined>;
type NumberSchema = BaseSchema<'number', number> & {
    params: {
        min?: number;
        max?: number;
    };
    min: (min: number) => NumberSchema;
    max: (max: number) => NumberSchema;
};
type StringSchema = BaseSchema<'string', string> & {
    params: {
        trim?: boolean;
    };
    trim: () => StringSchema;
};
type ObjectSchema<T> = BaseSchema<'object', T>;
type LiteralSchema<T> = BaseSchema<'literal', T>;
type UnionSchema<T extends BaseSchema[]> = BaseSchema<
    'union',
    {
        [K in keyof T]: Infer<T[K]>;
    }[number]
>;
type ArraySchema<T> = BaseSchema<'array', T[]>;

type TransformSchema<T> = BaseSchema<'transform', T>;

type Simplify<T> = { [K in keyof T]: T[K] } & {};

type ObjectSchemasToValues<T extends Record<string, BaseSchema>> = Simplify<
    {
        [K in keyof T as T[K] extends { type: 'optional' } ? K : never]?: Infer<T[K]>;
    } & {
        [K in keyof T as T[K] extends { type: 'optional' } ? never : K]: Infer<T[K]>;
    }
>;

const successResult = <T>(data: T) => ({
    success: true as const,
    data,
});

const errorResult = (error: ZodError) => ({
    success: false as const,
    error,
});

const z = {
    // * Transform
    transform: <T extends BaseSchema, V>(schema: T, func: (val: T['__value']) => V) => {
        const transformSchema: TransformSchema<V> = {
            type: 'transform',
            safeParse: (unknownValue) => {
                const result = schema.safeParse(unknownValue);
                if (result.success) return successResult(func(result.data));
                return errorResult(new ZodError(result.error.issues));
            },
            optional: () => z.optional(transformSchema),
            array: () => z.array(transformSchema),
            __value: undefined as never,
        };
        return transformSchema;
    },

    // * Union
    union: <T extends BaseSchema[]>(schemasTuple: T) => {
        const unionSchema: UnionSchema<T> = {
            type: 'union',
            safeParse: (unknownValue) => {
                const issues: ZodIssue[] = [];

                for (const schema of schemasTuple) {
                    const res = schema.safeParse(unknownValue);
                    if (res.success) {
                        return res;
                    } else {
                        issues.push(...res.error.issues);
                    }
                }
                return errorResult(new ZodError(issues));
            },
            optional: () => z.optional(unionSchema),
            array: () => z.array(unionSchema),
            __value: undefined as never,
        };
        return unionSchema;
    },

    // * Literal
    literal: <const T>(value: T) => {
        const literalSchema: LiteralSchema<T> = {
            type: 'literal',
            safeParse: (unknownValue) => {
                if (unknownValue === value) {
                    return successResult(unknownValue as T);
                }
                return errorResult(
                    new ZodError([
                        {
                            path: '',
                            code: 'literal_error',
                            message: `Value should be ${value}`,
                        },
                    ]),
                );
            },
            optional: () => z.optional(literalSchema),
            array: () => z.array(literalSchema),
            __value: undefined as never,
        };
        return literalSchema;
    },

    // * Optional
    optional: <T extends BaseSchema>(schema: T) => {
        const optionalSchema: OptionalSchema<Infer<T>> = {
            type: 'optional',
            safeParse: (unknownValue) => {
                if (unknownValue === undefined) {
                    return successResult(unknownValue);
                }
                return schema.safeParse(unknownValue);
            },
            optional: () => z.optional(optionalSchema),
            array: () => z.array(optionalSchema),
            __value: undefined as never,
        };
        return optionalSchema;
    },

    // * String
    string: (params?: { trim?: boolean }) => {
        const stringSchema: StringSchema = {
            type: 'string',
            safeParse: (unknownValue) => {
                if (typeof unknownValue === 'string') {
                    if (params?.trim) return successResult(unknownValue.trim());
                    return successResult(unknownValue);
                }
                return errorResult(
                    new ZodError([
                        {
                            code: 'not-string',
                            message: 'Value should be string',
                            path: '',
                        },
                    ]),
                );
            },
            optional: () => z.optional(stringSchema),
            array: () => z.array(stringSchema),
            trim: () => z.string({ ...params, trim: true }),
            params: params ?? {},
            __value: undefined as never,
        };

        return stringSchema;
    },

    // * Number
    number: (params?: { min?: number; max?: number }) => {
        const numberSchema: NumberSchema = {
            type: 'number',
            safeParse: (unknownValue) => {
                if (typeof unknownValue === 'number') {
                    let issues: ZodIssue[] = [];

                    if (numberSchema.params.max && unknownValue > numberSchema.params.max) {
                        issues.push({
                            code: 'number_max',
                            message: `Value should be less then ${numberSchema.params.max}`,
                            path: '',
                        });
                    }

                    if (numberSchema.params.min && unknownValue < numberSchema.params.min) {
                        issues.push({
                            code: 'number_min',
                            message: `Value should be more then ${numberSchema.params.min}`,
                            path: '',
                        });
                    }
                    if (issues.length === 0) {
                        return successResult(unknownValue);
                    }
                    return errorResult(new ZodError(issues));
                }

                return errorResult(
                    new ZodError([
                        {
                            code: 'not-number',
                            message: 'Value should be number',
                            path: '',
                        },
                    ]),
                );
            },
            optional: () => z.optional(numberSchema),
            array: () => z.array(numberSchema),
            max: (max: number) =>
                z.number({
                    ...params,
                    max,
                }),
            min: (min: number) =>
                z.number({
                    ...params,
                    min,
                }),
            params: params ?? {},
            __value: undefined as never,
        };

        return numberSchema;
    },

    // * Array
    array: <T extends BaseSchema>(schema: T) => {
        const arraySchema: ArraySchema<Infer<T>> = {
            type: 'array',
            safeParse: (unknownValue) => {
                if (!Array.isArray(unknownValue)) {
                    return errorResult(
                        new ZodError([
                            {
                                path: '',
                                code: 'array_error',
                                message: `is not array`,
                            },
                        ]),
                    );
                }

                const data: Array<unknown> = [];
                const issues: ZodIssue[] = [];

                unknownValue.forEach((item, ind) => {
                    const result = schema.safeParse(item);
                    if (result.success) {
                        data.push(result.data);
                    } else {
                        issues.push(
                            ...result.error.issues.map((i) => ({
                                ...i,
                                path: `/[${ind}]${i.path}`,
                            })),
                        );
                    }
                });

                if (issues.length === 0) {
                    return successResult(data as never);
                } else {
                    return errorResult(new ZodError(issues));
                }
            },
            optional: () => z.optional(arraySchema),
            array: () => z.array(arraySchema),
            __value: undefined as never,
        };
        return arraySchema;
    },

    // * Object
    object: <T extends Record<string, BaseSchema>>(schemasObject: T) => {
        const objectSchema: ObjectSchema<ObjectSchemasToValues<T>> = {
            type: 'object',
            safeParse: (unknownValue) => {
                if (typeof unknownValue !== 'object' || unknownValue === null) {
                    return errorResult(
                        new ZodError([
                            {
                                code: 'not-object',
                                message: 'Value should be object',
                                path: '',
                            },
                        ]),
                    );
                }

                const schemasEntires = Object.entries(schemasObject);

                const data: Record<string, unknown> = {};
                const issues: ZodIssue[] = [];

                for (const [key, schema] of schemasEntires) {
                    const objectValue = unknownValue[key as never];

                    // handle optional fields
                    if (!(key in unknownValue)) {
                        if (schema.type === 'optional') {
                            continue;
                        } else {
                            issues.push({
                                code: 'required',
                                message: `${key} is required`,
                                path: `/${key}`,
                            });
                            continue;
                        }
                    }

                    const result = schema.safeParse(objectValue);

                    if (result.success) {
                        data[key] = result.data;
                    } else {
                        issues.push(
                            ...result.error.issues.map((i) => ({
                                ...i,
                                path: `/${key}${i.path}`,
                            })),
                        );
                    }
                }

                if (issues.length === 0) {
                    return successResult(data as never);
                } else {
                    return errorResult(new ZodError(issues));
                }
            },
            optional: () => z.optional(objectSchema),
            array: () => z.array(objectSchema),
            __value: undefined as never,
        };

        return objectSchema;
    },
};

const RoleSchema = z.union([z.literal('user'), z.literal('admin')]);
type Role = Infer<typeof RoleSchema>;

const User = z.object({
    role: z.literal('user'),
    username: z.string().optional(),
    value: z.number().min(1).max(10),
    obj: z.object({
        key: z.string().optional(),
    }),
});

const Admin = z.object({
    role: z.literal('admin'),
    username: z.string().trim().optional(),
    value: z.number().min(1).max(10),
});

const AnyUser = z.union([User, Admin]);

const strSchema = z.string();

const res2 = strSchema.safeParse(1);

type Str = Infer<typeof strSchema>;

type User = Infer<typeof User>;

const ArraySchema = z.object({
    array: z.array(z.number()),
});
type ArrayType = Infer<typeof ArraySchema>;

const ObjectArraySchema = z.object({ name: z.string() }).array();
type ObjectArray = Infer<typeof ObjectArraySchema>;

const TransformSchema = z.transform(ObjectArraySchema, (val) => val[0].name);
type Transform = Infer<typeof TransformSchema>;

//const res = AnyUser.safeParse({ role: 'admin', value: 2, username: '   I am Admin!        ' });

const res = z.transform(z.number(), (val) => String(val)).safeParse('9');

if (res.success) {
    console.log(res);
} else {
    console.log(res.error.issues);
}
