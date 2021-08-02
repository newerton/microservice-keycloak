import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: "14px",
  },
  buttonSocialNetwork: {
    padding: "14px",
  },
  divider: {
    margin: theme.spacing(0, 0, 2, 0),
    backgroundColor: "rgba(255,255,255, 0.2)",
  },
}));

type IconsProps = {
  [key: string]: {
    icon: React.ReactNode;
    textColor: string;
    backgroundColor: string;
  };
};

const icons: IconsProps = {
  github: {
    icon: <GitHubIcon />,
    textColor: "#fff",
    backgroundColor: "#000",
  },
  facebook: {
    icon: <FacebookIcon />,
    textColor: "#fff",
    backgroundColor: "#000",
  },
};

export type LoginFormProps = {
  title: string;
  loginEnabled: boolean;
  loginAction: string;
  usernameEditDisabled: boolean;
  usernameLabel: string;
  passwordLabel: string;
  userNameExistsError: boolean;
  usernameError: string;
  usernameValue: string;
  enabledRememberMe: boolean;
  enabledLoginRememberMe: boolean;
  rememberMeLabel: string;
  resetPasswordAllowed: boolean;
  resetPasswordUrl: string;
  resetPasswordLabel: string;
  registrationAllowed: boolean;
  registrationNoAccount: string;
  registrationUrl: string;
  registrationLabel: string;
  selectedCredential: string;
  loginLabel: string;
  socialProviders?: {
    loginUrl: string;
    alias: string;
    providerId: string;
    displayName: string;
  }[];
};

const LoginForm: React.FunctionComponent<LoginFormProps> = (props) => {
  const classes = useStyles();
  const {
    loginEnabled,
    loginAction,
    usernameEditDisabled,
    usernameLabel,
    passwordLabel,
    userNameExistsError,
    usernameError,
    usernameValue,
    enabledRememberMe,
    enabledLoginRememberMe,
    rememberMeLabel,
    resetPasswordAllowed,
    resetPasswordUrl,
    resetPasswordLabel,
    registrationAllowed,
    registrationNoAccount,
    registrationUrl,
    registrationLabel,
    selectedCredential,
    loginLabel,
    socialProviders,
  } = props;

  return (
    <div>
      <Box textAlign="center">
        {!loginEnabled && (
          <Typography component="h1" variant="h5" className={classes.title}>
            Login desativado
          </Typography>
        )}
      </Box>
      {loginEnabled && (
        <form className={classes.form} action={loginAction} method="post">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label={usernameLabel}
            name="username"
            autoComplete="email"
            autoFocus
            disabled={usernameEditDisabled}
            defaultValue={usernameValue}
            error={userNameExistsError}
            helperText={usernameError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={passwordLabel}
            type="password"
            id="password"
            autoComplete="current-password"
            error={userNameExistsError}
            helperText={usernameError}
          />
          {enabledRememberMe && !usernameEditDisabled && (
            <FormControlLabel
              control={
                <Checkbox
                  value="rememberMe"
                  color="primary"
                  checked={enabledLoginRememberMe}
                />
              }
              label={rememberMeLabel}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {loginLabel}
          </Button>

          {socialProviders && (
            <>
              <Divider variant="fullWidth" className={classes.divider} />
              {socialProviders.map((socialProvider) => (
                <Button
                  fullWidth
                  key={socialProvider.alias}
                  variant="outlined"
                  href={socialProvider.loginUrl}
                  startIcon={icons[socialProvider.providerId].icon}
                  className={classes.buttonSocialNetwork}
                  style={{
                    color: icons[socialProvider.providerId].textColor,
                    backgroundColor:
                      icons[socialProvider.providerId].backgroundColor,
                  }}
                >
                  {loginLabel} {socialProvider.displayName}
                </Button>
              ))}
            </>
          )}
          <Grid container>
            <Grid item xs>
              {resetPasswordAllowed && (
                <Link href={resetPasswordUrl} variant="body2">
                  {resetPasswordLabel}
                </Link>
              )}
            </Grid>
            <Grid item>
              {registrationAllowed && (
                <>
                  {registrationNoAccount}{" "}
                  <Link href={registrationUrl} variant="body2">
                    {registrationLabel}
                  </Link>
                </>
              )}
            </Grid>
          </Grid>
          <input
            type="hidden"
            id="id-hidden-input"
            name="credentialId"
            defaultValue={selectedCredential}
          />
        </form>
      )}
    </div>
  );
};

export default LoginForm;
