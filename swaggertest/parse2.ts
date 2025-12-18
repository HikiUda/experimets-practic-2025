import { parse } from 'yaml';
import { readFileSync } from 'fs';

const readYaml = () => {
  const content = readFileSync('./swagger.yaml');
  const dataText = new TextDecoder().decode(content);

  const data = parse(dataText) as {
    paths: Record<string, object>;
    components: {
      schemas: Record<string, object>;
    };
  };
  console.log(data?.paths['/todo']['get']);
};

readYaml();
