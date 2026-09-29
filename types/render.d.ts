interface RenderBodyArgs {
    data: JsonSchema.Schema;
    lastUpdatedDate: Date;
}

/**
 * Renders the <body> and its child elements and returns its outerHTML.
 */
type RenderBodyFunc = (args: RenderBodyArgs) => string;
