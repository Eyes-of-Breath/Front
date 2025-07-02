import Sidebar from './Sidebar';
import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
                <Outlet/>
            </div>
        </div>
    );
}

export default Layout;