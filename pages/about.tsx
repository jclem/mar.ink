import {NextPage} from 'next'
import Link from 'next/link'
import {AppFrame} from '../components/AppFrame'

const source = `Y2xhc3NEaWFncmFtCglJLS0-WW91IDogQXBwcmVjaWF0ZQ`

const url = (path: string, withProto = true, withHost = true) => {
  const isProd = process.env.NODE_ENV === 'production'
  const isServer = typeof window === 'undefined'
  const host = isServer
    ? process.env.VERCEL_URL ?? 'localhost:3000'
    : location.host

  const proto = isServer ? (isProd ? 'https:' : 'http:') : location.protocol
  const protoString = withProto ? `${proto}//` : ''

  return `${protoString}${withHost ? host : ''}${path}`
}

const markdown = `\`\`\`markdown
![](${url(`/api/image/${source}`)})
\`\`\`
`

const AboutPage: NextPage = () => {
  return (
    <AppFrame>
      <div className="mx-auto my-8 px-4 pb-4 prose prose-sm sm:prose dark:prose-dark lg:prose-lg max-w-prose w-full">
        <h1>mar.ink</h1>

        <p>
          mar.ink is a service for drawing, viewing, and serving diagrams
          created with the{' '}
          <a href="https://mermaid-js.github.io/mermaid/#/">Mermaid</a> tool.
          The source code can be found at{' '}
          <a href="https://github.com/jclem/mar.ink">
            github.com/jclem/mar.ink
          </a>
          .
        </p>

        <p>
          mar.ink was created by <a href="https://jclem.net">Jonathan Clem</a>.
        </p>

        <h2>Help</h2>

        <h3>Website</h3>

        <h4>Creating Diagrams</h4>

        <p>
          Diagrams can be created right from the home page at{' '}
          <Link href="/">
            <a>mar.ink</a>
          </Link>
          . For help learning the Mermaid diagram syntax, take a look at the{' '}
          <a href="https://mermaid-js.github.io/mermaid/#/">
            Mermaid home page
          </a>
          .
        </p>

        <p>
          As you edit a diagram in mar.ink, the URL will be updated with each
          change to contain a{' '}
          <a href="https://en.wikipedia.org/wiki/Base64">Base64</a>-encoded
          representation of the diagram source code. This way, you can share a
          diagram and its code easily with someone else.
        </p>

        <h4>Viewing Diagrams</h4>

        <p>
          If you wish to view a diagram without the editor, you can use the
          view-only page whose URLs look like this:{' '}
          <code>
            <Link href={`/view/${source}`}>
              <a>{url(`/view/${source}`, false)}</a>
            </Link>
          </code>
        </p>

        <h4>Dark Mode</h4>

        <p>
          The mar.ink website will default to your system settings for its light
          and dark mode styles. However, you can also append the{' '}
          <code>darkMode=1</code> or
          <code>darkMode=0</code> query parameter to any mar.ink URL to set it
          manually.
        </p>

        <h3>API</h3>

        <h4>Embedding Diagrams</h4>

        <p>
          The basic way to embed a diagram is to use the mar.ink API endpoint
          that returns PNG images directly. The path for this API is{' '}
          <code>/api/image/$ENCODED_DIAGRAM</code>, where{' '}
          <code>$ENCODED_DIAGRAM</code> is the Base64-encoded representation of
          the diagram source.
        </p>

        <p>
          For example, in order to embed a simple diagram in Markdown, you could
          include something like this:
        </p>

        <pre>
          <code>{markdown}</code>
        </pre>

        <h4>Prettier Embeds</h4>

        <p>
          My recommendation for embeds, however, is <em>not</em> to use Markdown
          syntax, but instead to use a regular HTML <code>&lt;img/&gt;</code>{' '}
          tag. You&rsquo;ll notice that the editor page has an &ldquo;HTML Image
          Tag&rdquo; item in the &ldquo;Copy&rdquo; menu. The reason I recommend
          using this because the API captures images by default at a pixel ratio
          of 2. When you click the &ldquo;HTML Image Tag&rdquo; option, you get
          an image tag that links to the &ldquo;retina&rdquo; version of the
          image, but that also has the <code>width</code> and{' '}
          <code>height</code> parameters set so that the image displays at the
          correct size.{' '}
          <strong className="tldr">
            tl;dr You get a crisper, prettier embed using this method!
          </strong>
        </p>

        <p>
          These embeds can be sometimes slow to render, but once they&rsquo;re
          initially rendered, they are heavily cached. Likewise, you may
          occasionally experience rendering errors. Feel free to contact me at{' '}
          <a href="mailto:mar-ink@jclem.net">mar-ink@jclem.net</a> if anything
          seems off or is working unexpectedly, but keep in mind that I have a
          day job and this is run as a best-effort service 🙂.
        </p>

        <h4>Embed Query Parameters</h4>

        <p>
          The API that renders diagrams takes a couple of query parameters so
          that you can fine-tune your diagram:
        </p>

        <dl>
          <dt className="text-sm font-mono text-gray-500">darkMode</dt>
          <dd className="mt-1 text-sm text-gray-900">
            Set to <code>1</code> or <code>true</code> enables dark mode,
            omitted or set to <code>0</code> or <code>false</code> disables it.
          </dd>

          <dt className="mt-4 text-sm font-mono text-gray-500">
            deviceScaleFactor
          </dt>
          <dd className="mt-1 text-sm text-gray-900">
            Defaults to <code>2</code>, this controls the pixel ratio/scale
            factor of the browser used to render the diagram.
          </dd>
        </dl>

        <p>
          For example, to take a dark-mode screenshot at a device scale factor
          of 1, you would use a path like this:{' '}
          <code>
            <a href={url(`/api/image/${source}`)}>
              {url(`/api/image/${source}`, false, false)}
            </a>
          </code>
          .
        </p>

        <div className="text-center" aria-hidden="true">
          <hr className="m-0" />
          <span
            className="p-2 relative top-[-3.3rem] sm:top-[-4rem] lg:top-[-4.5rem] bg-white dark:bg-gray-900"
            aria-hidden="true"
          >
            🆒
          </span>
        </div>
      </div>
    </AppFrame>
  )
}

export default AboutPage
