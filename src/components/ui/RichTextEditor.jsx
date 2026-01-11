/**
 * Rich Text Editor Component
 * Simple WYSIWYG editor for blog content
 */
import { useState, useRef, useEffect } from 'react';
import './RichTextEditor.css';

export default function RichTextEditor({ value = '', onChange, placeholder = 'Start writing...' }) {
    const editorRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleInput = () => {
        const content = editorRef.current?.innerHTML || '';
        onChange(content);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    const insertImage = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            execCommand('insertImage', url);
        }
    };

    return (
        <div className={`rte ${isFocused ? 'rte--focused' : ''}`}>
            <div className="rte__toolbar">
                <div className="rte__toolbar-group">
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('underline')}
                        title="Underline (Ctrl+U)"
                    >
                        <u>U</u>
                    </button>
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('strikeThrough')}
                        title="Strikethrough"
                    >
                        <s>S</s>
                    </button>
                </div>

                <div className="rte__toolbar-group">
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('formatBlock', 'h2')}
                        title="Heading 2"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('formatBlock', 'h3')}
                        title="Heading 3"
                    >
                        H3
                    </button>
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('formatBlock', 'p')}
                        title="Paragraph"
                    >
                        P
                    </button>
                </div>

                <div className="rte__toolbar-group">
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('insertUnorderedList')}
                        title="Bullet List"
                    >
                        •
                    </button>
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('insertOrderedList')}
                        title="Numbered List"
                    >
                        1.
                    </button>
                </div>

                <div className="rte__toolbar-group">
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={insertLink}
                        title="Insert Link"
                    >
                        🔗
                    </button>
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={insertImage}
                        title="Insert Image"
                    >
                        🖼️
                    </button>
                </div>

                <div className="rte__toolbar-group">
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('undo')}
                        title="Undo"
                    >
                        ↶
                    </button>
                    <button
                        type="button"
                        className="rte__btn"
                        onClick={() => execCommand('redo')}
                        title="Redo"
                    >
                        ↷
                    </button>
                </div>
            </div>

            <div
                ref={editorRef}
                className="rte__editor"
                contentEditable
                onInput={handleInput}
                onPaste={handlePaste}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                data-placeholder={placeholder}
            />
        </div>
    );
}
