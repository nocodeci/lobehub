export class VariableResolver {
    /**
     * Resolves variables in a template string using the execution context.
     * Format: {{variable_name}} or <NodeName.property>
     */
    static resolve(template: string, context: Record<string, any>): string {
        if (!template) return "";

        // Replace {{var}} format
        let result = template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
            const value = this.getValueByPath(context, path.trim());
            return value !== undefined ? String(value) : match;
        });

        // Replace <Node.prop> format (Sim style)
        result = result.replace(/<([^>]+)>/g, (match, path) => {
            const value = this.getValueByPath(context, path.trim());
            return value !== undefined ? String(value) : match;
        });

        return result;
    }

    private static getValueByPath(obj: any, path: string): any {
        if (!path || !obj) return undefined;

        // Check if path exists directly
        if (obj[path] !== undefined) return obj[path];

        // Navigate nested path
        return path.split('.').reduce((current: any, key: string) => {
            return current?.[key];
        }, obj);
    }
}
