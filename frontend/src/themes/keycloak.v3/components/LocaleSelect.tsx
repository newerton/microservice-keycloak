import {
  createStyles,
  InputBase,
  Select,
  SelectProps,
  Theme,
  withStyles,
} from "@material-ui/core";

interface LocaleSelectProps extends SelectProps {
  locales: { label: string; url: string }[];
}

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 15,
      padding: "10px 26px 10px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  })
)(InputBase);

const LocaleSelect: React.FunctionComponent<LocaleSelectProps> = (props) => {
  const { locales, ...selectProps } = props;

  const handleSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    const locale = locales.find((l) => event.target.value === l.label);
    window.location.href = locale!.url;
  };
  
  return (
    <Select
      native
      {...selectProps}
      onChange={(event) => handleSelect(event)}
    >
      {locales.map((locale, key) => (
        <option value={locale.label} key={key}>
          {locale.label}
        </option>
      ))}
    </Select>
  );
};

export default LocaleSelect;
