import styles from './page.module.scss';

import ThemeToggle from '@/src/code/components/ThemeToggle';

export default function ButtonsTestPage() {
  return (
    <div className="trmrk-app-layout">
      <div className="trmrk-app-header">
        <div className="trmrk-horiz-strip">
        </div>
        <div className="trmrk-horiz-strip">
        </div>
      </div>
      <div className="trmrk-app-body"></div>
      <div className="trmrk-app-footer">
        <div className="trmrk-horiz-strip">
        </div>
      </div>
    </div>
  );
}
