import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button, ButtonGroup } from '@heroui/react'

type PostBodyEditorProps = {
  value: string
  onChange: (html: string) => void
  onBlur?: () => void
}

export function PostBodyEditor({
  value,
  onChange,
  onBlur,
}: PostBodyEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: '本文を入力…',
      }),
    ],
    content: value || '<p></p>',
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML())
    },
    onBlur: () => {
      onBlur?.()
    },
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-slate max-w-none px-3 py-2',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value || '<p></p>', { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-2">
        <ButtonGroup variant="secondary" size="sm">
          <Button
            onPress={() => editor.chain().focus().toggleBold().run()}
            data-active={editor.isActive('bold') || undefined}
          >
            Bold
          </Button>
          <Button
            onPress={() => editor.chain().focus().toggleItalic().run()}
            data-active={editor.isActive('italic') || undefined}
          >
            Italic
          </Button>
          <Button
            onPress={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </Button>
          <Button
            onPress={() => editor.chain().focus().toggleBulletList().run()}
          >
            List
          </Button>
          <Button
            onPress={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            Code
          </Button>
        </ButtonGroup>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => {
            const url = window.prompt('リンクURL')
            if (!url) return
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
          }}
        >
          Link
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => {
            const url = window.prompt('画像URL')
            if (!url) return
            editor.chain().focus().setImage({ src: url }).run()
          }}
        >
          Image URL
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
