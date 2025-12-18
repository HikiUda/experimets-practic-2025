import { Link, Outlet } from 'react-router-dom';

export const App = () => {
    return (
        <div data-testid={'App.DataTestId'}>
            <h1>Host</h1>
            <br />
            <Link to={'/about'}>about</Link>
            <br />
            <Link to={'/shop/main'}>shop</Link>
            <Link to={'/shop/second'}>shop</Link>
            <Outlet />
        </div>
    );
};
