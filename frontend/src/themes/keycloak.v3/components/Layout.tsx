import {
  Box,
  Container,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import Copyright from "./Copyright";
import LocaleSelect from "./LocaleSelect";
import logo from "../../../static/logo.png";
import Alert, { Color } from "@material-ui/lab/Alert";

export type LayoutProps = {
  i18nEnabled: boolean;
  locale?: { currentLocale: string; locales: { label: string; url: string }[] };
  title: string;
  message?: {
    type: Color;
    summary: string;
  };
  isAppInitiatedAction: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

export const Layout: React.FunctionComponent<LayoutProps> = (props) => {
  const {
    i18nEnabled,
    locale,
    title,
    children,
    message,
    isAppInitiatedAction,
  } = props;
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Box textAlign="center">
        <img src={logo} alt="logo" className={classes.logo} />
        <Typography component="h1" variant="h5" className={classes.title}>
          {title}
        </Typography>
      </Box>
      {message && !isAppInitiatedAction && (
        <Alert
          variant="outlined"
          severity={message.type}
          className={classes.alert}
        >
          {message.summary}
        </Alert>
      )}
      {children}
      <Box mt={4} width="100%" className={classes.footer}>
        {i18nEnabled && locale && (
          <LocaleSelect
            locales={locale?.locales}
            defaultValue={locale?.currentLocale}
            disableUnderline={true}
          />
        )}
        <Copyright />
      </Box>
    </Container>
  );
};
