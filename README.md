# passwordcockpit/frontend

## General
This markdown shows information related to the frontend side of the project. For more detailed information about the project please check the [Passwordcockpit README](https://github.com/passwordcockpit/passwordcockpit/blob/master/README.md).

## Language
Current supported languages are: `'en', 'it', 'de', 'fr'`.

To add your own language, please create your translation file `xx.yaml` under `translations/` folder.<br>
`xx` should be the ISO 639-1 code of the language.

Modify in `config/environment.js` the following line:
```
APP: {
            ...
            languages: ['en', 'it', 'de', 'fr', 'xx'],
            userLanguages: [
                {
                    value: 'xx',
                    text: 'displayText'
                },
        },
```
