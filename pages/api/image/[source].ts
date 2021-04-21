import chromium from 'chrome-aws-lambda'
import * as crypto from 'crypto'
import * as fs from 'fs'
import {NextApiHandler} from 'next'
import * as os from 'os'
import * as path from 'path'

const isProd = process.env.NODE_ENV === 'production'
const url = isProd ? process.env.VERCEL_URL : 'localhost:3000'

const GetImage: NextApiHandler = async (req, res) => {
  const sourceParam = req.query.source as string
  const deviceScaleFactor = parseInt(
    (req.query.deviceScaleFactor as string) ?? '2',
    10
  )
  const darkMode = req.query.darkMode as string

  const browser = await getBrowserInstance()

  const page = await browser.newPage({
    deviceScaleFactor,
    ignoreHTTPSErrors: true
  })

  const protocol = isProd ? 'https:' : 'http:'
  await page.goto(
    `${protocol}//${url}/view/${sourceParam}${darkMode ? '?darkMode=true' : ''}`
  )

  const screenshotPath = path.resolve(
    os.tmpdir(),
    `${crypto.randomBytes(16).toString('hex')}.png`
  )

  const elementHandle = await page.$('svg')

  if (!elementHandle) {
    res.status(500).json({error: 'No SVG found'})
    return
  }

  await elementHandle.screenshot({path: screenshotPath})

  res.setHeader('Content-Type', 'image/png')

  res.setHeader(
    'Cache-Control',
    'max-age=604800, s-maxage=86400, stale-while-revalidate'
  )

  fs.createReadStream(screenshotPath).pipe(res)
}

export default GetImage

async function getBrowserInstance() {
  const executablePath = await chromium.executablePath

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const playwright: typeof import('playwright-core') = require('playwright-core')

  if (!executablePath) {
    // `executablePath` is null when running locally.
    return playwright.chromium.launch({
      args: chromium.args,
      headless: true
    })
  }

  return playwright.chromium.launch({
    args: chromium.args,
    executablePath,
    headless: chromium.headless
  })
}
