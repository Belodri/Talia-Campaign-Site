/**
 * Props for {@link Raw}.
 */
interface RawProps {
    /**
     * A trusted HTML string to be parsed into real DOM nodes.
     */
    html: string
}

/**
 * Renders a trusted HTML string as a `DocumentFragment`, for use as a JSX
 * child alongside ordinary elements and components.
 *
 * Parses `html` via a detached `<template>` element and returns its
 * `.content`, so the resulting nodes are inserted in place with no extra
 * wrapper element left behind.
 */
export function Raw({ html }: RawProps): DocumentFragment {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
}