export default () => ({ // eslint-disable-line

  // link file UUID
  id: '$uuid',

  // canonical URL of the published page
  // "$url" get filled in by the ./configure script
  url: '$url',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date(),

  headline: 'FTCR Indices Dashboard',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'The latest updates on consumer sentiment, exports, labour, real estate and underground lending' +
           '',

  topic: {
    name: 'FT Confidential Research - EM Squared',
    url: '/foo',
  },

  relatedArticle: {
    text: 'Related articles »',
    url: 'https://www.ft.com/emerging-markets/ft-confidential-research',
  },

  mainImage: {
    title: 'sdv',
    description: '',
    url: '',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'FTCR', url: '/foo/bar' },
    { name: 'David Wilder' },
    { name: 'Ben Heubl' },
  ],

  // Appears in the HTML <title>
  title: '',

  // meta data
  description: '',

  /*
  TODO: Select Twitter card type -
        "summary" or "summary_large_image"

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialSummary:  '',

  // TWITTER
  // twitterImage: '',
  // twitterCreator: '@individual's_account',
  // tweetText:  '',
  // twitterHeadline:  '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to "IG"
    however another value may be needed
    */
    // product: '',
  },
});
