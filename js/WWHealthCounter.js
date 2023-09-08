import InputComponent from '../../../systems/custom-system-builder/module/sheets/components/InputComponent.js';

/**
 * White Wolf style health counter (4 states)
 * @ignore
 */
class WWHealthCounter extends InputComponent {	

    /**
     * WWHealthCounter default state
     * @type {boolean}
     * @private
     */
    _defaultDisabled;

	/**
     * WWHealthCounter constructor
     * @param {Object} data Component data
     * @param {string} data.key Component key
     * @param {string|null} [data.tooltip] Component tooltip
     * @param {string} data.templateAddress Component address in template, i.e. component path from actor.system object
     * @param {string|null} [data.label=null] Field label
     * @param {string|null} [data.size=null] Field size. Can be full-size, small, medium or large.
     * @param {string|null} [data.defaultDisabled=null] WWHealthCounter default state.
     * @param {string|null} [data.cssClass=null] Additional CSS class to apply at render
     * @param {Number} [data.role=0] Component minimum role
     * @param {Number} [data.permission=0] Component minimum permission
     * @param {string|null} [data.visibilityFormula=null] Component visibility formula
     * @param {Container|null} [data.parent=null] Component's container
     */
    constructor({
        key,
        tooltip = null,
        templateAddress,
        label = null,
        size = null,
        defaultDisabled = false,
        cssClass = null,
        role = 0,
        permission = 0,
        visibilityFormula = null,
        parent = null
    }) {
        super({
            key: key,
            tooltip: tooltip,
            templateAddress: templateAddress,
            label: label,
            defaultValue: null,
            size: size,
            cssClass: cssClass,
            role: role,
            permission: permission,
            visibilityFormula: visibilityFormula,
            parent: parent
        });
		
		this._defaultDisabled = defaultDisabled;
    }
	
	/**
     * Renders component
     * @override
     * @param {TemplateSystem} entity Rendered entity (actor or item)
     * @param {boolean} [isEditable=true] Is the component editable by the current user ?
     * @return {Promise<JQuery<HTMLElement>>} The jQuery element holding the component
     */
    async _getElement(entity, isEditable = true, options = {}) {
        let jQElement = await super._getElement(entity, isEditable, options);
        jQElement.addClass('custom-system-wwhealthcounter');

        let inputElement = $('<input />');
        inputElement.attr('type', 'text');
        inputElement.attr('readonly', 'readonly');
        inputElement.attr('id', `${entity.uuid}-${this.key}`);

        if (!entity.isTemplate) {
            inputElement.attr('name', 'system.props.' + this.key);
        }

        if (!isEditable) {
            inputElement.attr('disabled', 'disabled');
        }
		
		if (this._defaultDisabled) {
			inputElement.attr('data-state', '.');
		} 
		else {
			inputElement.attr('data-state', ' ');
		}

		inputElement.on('click', (ev) => {
			ev.target.dataset.state = ' /x*.'[(' /x*.'.indexOf(ev.target.dataset.state) + 1)%5];
		});

        jQElement.append(inputElement);
		
        if (entity.isTemplate) {
            jQElement.addClass('custom-system-editable-component');
            inputElement.addClass('custom-system-editable-field');

            jQElement.on('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                this.editComponent(entity);
            });
        }

        return jQElement;
    }
	
	/**
     * Returns serialized component
     * @override
     * @return {Object}
     */
    toJSON() {
        let jsonObj = super.toJSON();

        return {
            ...jsonObj,
            type: 'wWHealthCounter',
            defaultDisabled: this._defaultDisabled
        };
    }
	
	/**
     * Creates WWHealthCounter from JSON description
     * @override
     * @param {Object} json
     * @param {string} templateAddress
     * @param {Container|null} parent
     * @return {WWHealthCounter}
     */
    static fromJSON(json, templateAddress, parent = null) {
        return new WWHealthCounter({
            key: json.key,
            tooltip: json.tooltip,
            templateAddress: templateAddress,
            label: json.label,
            size: json.size,
            defaultDisabled: json.defaultDisabled,
            cssClass: json.cssClass,
            role: json.role,
            permission: json.permission,
            visibilityFormula: json.visibilityFormula,
            parent: parent
        });
    }

	/**
     * Gets pretty name for this component's type
     * @return {string} The pretty name
     * @throws {Error} If not implemented
     */
    static getPrettyName() {
        return 'WWHealthCounter';
    }

    /**
     * Get configuration form for component creation / edition
     * @return {Promise<JQuery<HTMLElement>>} The jQuery element holding the component
     */
    static async getConfigForm(existingComponent) {
        let mainElt = $('<div></div>');

        mainElt.append(
            await renderTemplate(
                `modules/csb-exalted2e-module/html/wwhealthcounter.html`,
                existingComponent
            )
        );

        return mainElt;
    }

    /**
     * Extracts configuration from submitted HTML form
     * @override
     * @param {JQuery<HTMLElement>} html The submitted form
     * @return {Object} The JSON representation of the component
     * @throws {Error} If configuration is not correct
     */
    static extractConfig(html) {
        let fieldData = super.extractConfig(html);

        if (!fieldData.key) {
            throw new Error('Component key is mandatory for wwhealthcounter');
        }

        fieldData.label = html.find('#wwhealthcounterLabel').val();
        fieldData.size = html.find('#wwhealthcounterSize').val();
        fieldData.defaultDisabled = html.find('#wwhealthcounterDefaultDisabled').is(':checked');

        return fieldData;
    }
}


/**
 * @ignore
 */
export default WWHealthCounter;