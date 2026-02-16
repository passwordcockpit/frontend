import { modifier } from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

/**
 * Ember modifier that initializes TinyMCE on `element`.
 *
 * Named args:
 * - config: TinyMCE init options (optional)
 * - content: initial HTML content (optional)
 * - onEditorContentChange(html): called on editor content changes (optional)
 *
 */
export default modifier(function editor(element, _positional, named) {
    let tinymce = window.tinymce;
    let editorInstance;

    tinymce.init({
        target: element,
        license_key: 'gpl',
        content_css: '/assets/vendor.css',
        ...named.config,
        setup: (ed) => {
            editorInstance = ed;            
            ed.on('init', () => ed.setContent(named.content ?? ''));
            ed.on('change keyup setcontent', () => {
                named.onEditorContentChange?.(ed.getContent());
            });
            named.config?.setup?.(ed);
        },
    });

    registerDestructor(this, () => {
        if (editorInstance) editorInstance.remove();
    });
});
