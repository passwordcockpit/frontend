echo 'Copying TinyMCE assets from node_modules to public'

cp -R node_modules/tinymce/icons public/tinymce
cp -R node_modules/tinymce/models public/tinymce
cp -R node_modules/tinymce/plugins public/tinymce
cp -R node_modules/tinymce/skins public/tinymce
cp -R node_modules/tinymce/themes public/tinymce

LANGDIR=public/assets/langs
if [ -d "$LANGDIR" ];
then
    echo "$LANGDIR directory exists. Skipping creation"
else
	mkdir $LANGDIR
fi

cp node_modules/tinymce-i18n/langs/de.js public/assets/langs/de.js
cp node_modules/tinymce-i18n/langs/fr_FR.js public/assets/langs/fr_FR.js
cp node_modules/tinymce-i18n/langs/it.js public/assets/langs/it.js
cp node_modules/tinymce-i18n/langs/it.js public/assets/langs/en.js

echo "Finished copying TinyMCE files"