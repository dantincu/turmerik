import styles from './page.module.scss';

export default function ButtonsTestPage() {
  console.log('Styles object:', styles)

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className={styles.trmrkAsdf}>
        <h1>Buttons Test Page</h1>
      </div>
    </div>
  );
}
