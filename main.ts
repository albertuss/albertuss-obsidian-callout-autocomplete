import { Plugin, Editor, EditorPosition, EditorSuggest, EditorSuggestTriggerInfo, EditorSuggestContext, setIcon } from 'obsidian';

// Интерфейс для callout с типом, иконкой и цветом
interface CalloutItem {
    type: string;
    icon: string;
    color: string;
}

// Класс для автодополнения
class CalloutSuggest extends EditorSuggest<CalloutItem> {
    private plugin: CalloutAutocompletePlugin;
    private calloutItems: CalloutItem[] = [];

    constructor(plugin: CalloutAutocompletePlugin) {
        super(plugin.app);
        this.plugin = plugin;
    }

    loadCalloutItems() {
        const calloutManager = (this.app as any).plugins.plugins['callout-manager'];
        console.log('Callout Manager:', calloutManager);
        console.log('Callout Manager full settings:', JSON.stringify(calloutManager?.settings, null, 2));

        if (!calloutManager || !calloutManager.settings || !calloutManager.settings.callouts) {
            this.calloutItems = [
                { type: 'note', icon: 'lucide-sticky-note', color: '68, 138, 255' },
                { type: 'info', icon: 'lucide-info', color: '0, 176, 255' },
                { type: 'warning', icon: 'lucide-alert-triangle', color: '255, 171, 0' },
                { type: 'error', icon: 'lucide-x-circle', color: '255, 71, 87' },
                { type: 'success', icon: 'lucide-check-circle', color: '0, 135, 90' },
                { type: 'tip', icon: 'lucide-lightbulb', color: '0, 191, 165' },
                { type: 'quote', icon: 'lucide-quote', color: '158, 158, 158' },
                { type: 'example', icon: 'lucide-list', color: '124, 77, 255' },
                { type: 'seealso', icon: 'lucide-link', color: '0, 176, 255' },
                { type: 'abstract', icon: 'lucide-book-open', color: '0, 176, 255' },
                { type: 'summary', icon: 'lucide-book-open', color: '0, 176, 255' },
                { type: 'important', icon: 'lucide-flame', color: '0, 191, 165' },
                { type: 'faq', icon: 'lucide-help-circle', color: '0, 135, 90' },
                { type: 'caution', icon: 'lucide-alert-triangle', color: '255, 171, 0' },
                { type: 'attention', icon: 'lucide-alert-triangle', color: '255, 171, 0' },
                { type: 'failure', icon: 'lucide-x-circle', color: '255, 71, 87' }
            ];
            return;
        }

        const calloutSettings = calloutManager.settings.callouts;
        const customCallouts = calloutSettings.custom || [];
        const settings = calloutSettings.settings || {};

        const allCallouts: string[] = [];
        const defaultCallouts = [
            'note', 'info', 'warning', 'error', 'success', 'tip', 'quote', 'example',
            'seealso', 'abstract', 'summary', 'important', 'faq', 'caution', 'attention', 'failure'
        ];
        allCallouts.push(...defaultCallouts);

        if (customCallouts.length > 0) {
            allCallouts.push(...customCallouts);
        }

        this.calloutItems = allCallouts.map(type => {
            const typeSettings = settings[type];
            let icon = this.getDefaultIcon(type);
            let color = this.getDefaultColor(type);

            if (typeSettings && typeSettings.length > 0) {
                const baseSettings = typeSettings.find((s: any) => !s.condition);
                if (baseSettings?.changes) {
                    icon = baseSettings.changes.icon || icon;
                    color = baseSettings.changes.color || color;
                }
            }

            return { type, icon, color };
        });

        console.log('Final callout items:', this.calloutItems);
    }

    private getDefaultIcon(type: string): string {
        const iconMap: { [key: string]: string } = {
            note: 'lucide-sticky-note',
            info: 'lucide-info',
            warning: 'lucide-alert-triangle',
            error: 'lucide-x-circle',
            success: 'lucide-check-circle',
            tip: 'lucide-lightbulb',
            quote: 'lucide-quote',
            example: 'lucide-list',
            seealso: 'lucide-link',
            abstract: 'lucide-book-open',
            summary: 'lucide-book-open',
            important: 'lucide-flame',
            faq: 'lucide-help-circle',
            caution: 'lucide-alert-triangle',
            attention: 'lucide-alert-triangle',
            failure: 'lucide-x-circle',
            positive: 'lucide-plus',
            negative: 'lucide-minus',
            question: 'lucide-help-circle',
            test: 'lucide-triangle'
        };
        return iconMap[type] || 'lucide-sticky-note';
    }

    private getDefaultColor(type: string): string {
        const colorMap: { [key: string]: string } = {
            note: '68, 138, 255',
            info: '0, 176, 255',
            warning: '255, 171, 0',
            error: '255, 71, 87',
            success: '0, 135, 90',
            tip: '0, 191, 165',
            quote: '158, 158, 158',
            example: '124, 77, 255',
            seealso: '0, 176, 255',
            abstract: '0, 176, 255',
            summary: '0, 176, 255',
            important: '0, 191, 165',
            faq: '0, 135, 90',
            caution: '255, 171, 0',
            attention: '255, 171, 0',
            failure: '255, 71, 87'
        };
        return colorMap[type] || '68, 138, 255';
    }

    onTrigger(cursor: EditorPosition, editor: Editor, file: any): EditorSuggestTriggerInfo | null {
        const line = editor.getLine(cursor.line).trimStart();
        console.log('Current line:', line, 'Cursor position:', cursor);
        if (line.startsWith('> [') && cursor.ch >= 3) {
            const startCh = line.indexOf('[') + 2;
            const triggerText = line.substring(startCh, cursor.ch).trim();
            console.log('Trigger activated, query:', triggerText);
            return {
                start: { line: cursor.line, ch: startCh },
                end: { line: cursor.line, ch: cursor.ch },
                query: triggerText,
            };
        }
        console.log('Trigger condition not met');
        return null;
    }

    getSuggestions(context: EditorSuggestContext): CalloutItem[] {
        const query = context.query.toLowerCase();
        return this.calloutItems.filter(item => item.type.toLowerCase().startsWith(query));
    }

    renderSuggestion(suggestion: CalloutItem, el: HTMLElement): void {
        const wrapper = el.createDiv({ cls: 'callout-suggestion-item' });
        const iconSpan = wrapper.createSpan({ cls: 'callout-suggestion-icon' });
        setIcon(iconSpan, suggestion.icon);
        const textSpan = wrapper.createSpan({ cls: 'callout-suggestion-text' });
        textSpan.setText(suggestion.type);

        // Применяем цвет только к иконке и тексту
        const color = suggestion.color;
        iconSpan.style.color = `rgb(${color})`;
        textSpan.style.color = `rgb(${color})`;
    }

    selectSuggestion(suggestion: CalloutItem, evt: MouseEvent | KeyboardEvent): void {
        const { editor, start, end } = this.context;
        if (editor) {
            editor.replaceRange(suggestion.type, start, end);
            const newPos = { line: start.line, ch: start.ch + suggestion.type.length };
            editor.setCursor(newPos);
        }
    }
}

export default class CalloutAutocompletePlugin extends Plugin {
    private suggester: CalloutSuggest;

    async onload() {
        console.log('Loading Callout Autocomplete Plugin');
        this.suggester = new CalloutSuggest(this);
        this.registerEditorSuggest(this.suggester);

        const style = document.createElement('style');
        style.textContent = `
            .callout-suggestion-item {
                display: flex;
                align-items: center;
                padding: 0px 0px; /* Отступы внутри элемента (сверху/снизу 8px, слева/справа 12px) */
                border-radius: 4px; /* Закругление углов элемента */
                margin: 0px 0; /* Внешние отступы (сверху/снизу 2px, слева/справа 0) */
                transition: background-color 0.1s ease;
                background-color: transparent;
            }
            .callout-suggestion-item:hover,
            .callout-suggestion-item.is-selected {
                background-color: var(--background-modifier-hover);
            }
            .callout-suggestion-icon {
                margin-right: 5px; /* Отступ между иконкой и текстом */
                width: 16px; /* Ширина иконки */
                height: 16px; /* Высота иконки */
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .callout-suggestion-icon svg {
                width: 20px; /* Размер SVG-иконки по ширине */
                height: 20px; /* Размер SVG-иконки по высоте */
            }
            .callout-suggestion-text {
                flex: 1;
                font-size: 14px; /* Размер шрифта текста */
                font-weight: 500;
            }
            .suggestion-container {
                padding: 0px; /* Внутренний отступ контейнера (влияет на расстояние от края списка до элементов) */
                background-color: var(--background-primary);
                border: 1px solid var(--background-modifier-border);
                border-radius: 4px; /* Закругление углов контейнера */
                box-shadow: 0 2px 8px var(--background-modifier-box-shadow);
            }
        `;
        document.head.appendChild(style);

        this.app.workspace.onLayoutReady(() => {
            console.log('Layout ready, loading callout types...');
            this.suggester.loadCalloutItems();

            const calloutManager = (this.app as any).plugins.plugins['callout-manager'];
            if (calloutManager) {
                this.registerEvent(
                    this.app.metadataCache.on('changed', () => {
                        console.log('Settings changed, reloading callout types...');
                        this.suggester.loadCalloutItems();
                    })
                );
            }
        });
    }

    onunload() {
        console.log('Unloading Callout Autocomplete Plugin');
    }
}