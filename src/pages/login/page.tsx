import Classes from './index.module.css';
import GoogleSvg from '@/components/svg/GoogleSvg';
import { useAuth } from '@/context/AuthProvider';

export default function Login() {
    const { loginWithGoogle, loginWithEmail } = useAuth();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            await loginWithEmail(e?.currentTarget?.email.value, e?.currentTarget?.password.value);
            window.location.href = '/';
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={Classes.container}>
            <div className={Classes.card}>
                <h1 className={Classes.title}>Connexion</h1>

                <button onClick={loginWithGoogle} className={Classes.googleButton}>
                    <GoogleSvg width={28} height={28} />
                    <span>Continuer avec Google</span>
                </button>

                <div className={Classes.divider}>
                    <div className={Classes.line} />
                    <span>ou</span>
                    <div className={Classes.line} />
                </div>

                <form onSubmit={handleLogin} className={Classes.form}>
                    <input name='email' type='email' placeholder='Adresse e-mail' required />
                    <input name='password' type='password' placeholder='Mot de passe' required />
                    <button type='submit'>Se connecter</button>
                </form>

                <p className={Classes.registerHint}>
                    Pas encore de compte ? <a href='/register'>Inscrivez-vous</a>
                </p>
            </div>
        </div>
    );
}
