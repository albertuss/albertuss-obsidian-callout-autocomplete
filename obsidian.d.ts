declare module 'obsidian' {
    export class Plugin {
        app: App;
        constructor(app: App);
        onload(): Promise<void>;
        onunload(): void;
        registerEditorSuggest(suggest: EditorSuggest<any>): void;
    }

    export interface App {
        plugins: {
            plugins: { [key: string]: any };
        };
    }

    export abstract class EditorSuggest<T> {
        constructor(app: App);
        protected app: App;
        protected context: EditorSuggestContext;
        abstract onTrigger(cursor: EditorPosition, editor: Editor, file: any): EditorSuggestTriggerInfo | null;
        abstract getSuggestions(context: EditorSuggestContext): T[];
        abstract renderSuggestion(suggestion: T, el: HTMLElement): void;
        abstract selectSuggestion(suggestion: T, evt: MouseEvent | KeyboardEvent): void;
    }

    export interface EditorPosition {
        line: number;
        ch: number;
    }

    export interface Editor {
        getLine(line: number): string;
        replaceRange(replacement: string, from: EditorPosition, to: EditorPosition): void;
        setCursor(pos: EditorPosition): void;
    }

    export interface EditorSuggestTriggerInfo {
        start: EditorPosition;
        end: EditorPosition;
        query: string;
    }

    export interface EditorSuggestContext {
        query: string;
        start: EditorPosition;
        end: EditorPosition;
        editor: Editor;
    }

    export interface HTMLElement {
        setText(text: string): void;
    }
}