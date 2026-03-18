export default {
  "discoverModules": [
    {
      "id": "featured-star",
      "type": "Featured star",
      "title": "Follow a rotating stellar anchor each day",
      "description": "Heavens highlights one locally curated object each day so returning visitors always have a fresh science starting point without relying on a live backend.",
      "objectIds": [
        "sirius",
        "betelgeuse",
        "polaris"
      ],
      "ctaLabel": "Open today's object",
      "ctaHref": "pages/explore.html"
    },
    {
      "id": "spectral-spotlight",
      "type": "Spectral spotlight",
      "title": "Why spectral classes turn starlight into evidence",
      "description": "The OBAFGKM sequence is more than a memory trick: it links color, temperature, and the atomic fingerprints spread across a stellar spectrum.",
      "topicIds": [
        "stellar-classification",
        "understanding-starlight"
      ],
      "ctaLabel": "Study starlight",
      "ctaHref": "pages/learn.html#path-understanding-starlight"
    },
    {
      "id": "stellar-lifecycle-focus",
      "type": "Stellar lifecycle focus",
      "title": "Trace how mass changes a star's entire story",
      "description": "Compare calm low-mass futures with explosive massive-star endings, then jump to examples in the catalog that represent each stage of evolution.",
      "topicIds": [
        "stellar-life-cycle"
      ],
      "objectIds": [
        "sun",
        "betelgeuse",
        "orion-nebula"
      ],
      "ctaLabel": "See the pathway",
      "ctaHref": "pages/learn.html#path-stellar-life-cycle"
    },
    {
      "id": "cosmic-question",
      "type": "Cosmic question of the day",
      "title": "How can astronomers know what a star is made of without touching it?",
      "description": "By splitting light into spectra and matching the missing or bright lines to atoms measured in laboratories on Earth, astronomers can infer composition across enormous distances.",
      "topicIds": [
        "how-astronomers-know",
        "understanding-starlight"
      ],
      "ctaLabel": "Read the explanation",
      "ctaHref": "pages/learn.html#path-how-astronomers-know"
    },
    {
      "id": "deep-sky-feature",
      "type": "Deep sky object feature",
      "title": "Star nurseries show that the night sky is still changing",
      "description": "Nebulae such as Orion, Eagle, and Lagoon are not static clouds. They are laboratories where gravity, radiation, and chemistry shape the next generation of stars.",
      "objectIds": [
        "orion-nebula",
        "eagle-nebula",
        "lagoon-nebula"
      ],
      "ctaLabel": "Explore the nurseries",
      "ctaHref": "pages/explore.html?category=Nebulae"
    },
    {
      "id": "research-spotlight",
      "type": "Research spotlight",
      "title": "Variable stars and standard candles connect local observing to cosmic distance scales",
      "description": "Objects like Polaris help bridge backyard curiosity and professional measurement by showing how pulsation and luminosity can become reliable distance clues.",
      "objectIds": [
        "polaris"
      ],
      "topicIds": [
        "distances-in-space",
        "how-astronomers-know"
      ],
      "ctaLabel": "See the research trail",
      "ctaHref": "pages/discover.html#research-spotlight"
    }
  ],
  "topics": [
    {
      "id": "understanding-starlight",
      "title": "Understanding starlight",
      "summary": "Learn how brightness, spectra, and color carry physical information from distant objects.",
      "description": "Starlight is astronomy's main evidence stream. Even when a star is impossibly distant, the light it sends can reveal its temperature, chemistry, motion, and environment.",
      "pageHref": "pages/learn.html#path-understanding-starlight",
      "tag": "Light",
      "relatedObjectIds": [
        "sun",
        "sirius",
        "rigel"
      ]
    },
    {
      "id": "stellar-classification",
      "title": "How stars are classified",
      "summary": "Spectral classes organize stars by temperature and the appearance of their spectra.",
      "description": "Classification lets astronomers compare stars systematically. Spectral classes turn subtle patterns in light into a framework that connects physics, color, and stellar evolution.",
      "pageHref": "pages/learn.html#path-stellar-classification",
      "tag": "Classification",
      "relatedObjectIds": [
        "sirius",
        "vega",
        "betelgeuse",
        "rigel"
      ]
    },
    {
      "id": "stellar-life-cycle",
      "title": "The life cycle of stars",
      "summary": "Gravity and mass determine how stars form, live, and die.",
      "description": "A nebula can collapse into protostars, a main-sequence star can shine for billions of years, and mass decides whether the ending is gentle or explosive.",
      "pageHref": "pages/learn.html#path-stellar-life-cycle",
      "tag": "Evolution",
      "relatedObjectIds": [
        "sun",
        "betelgeuse",
        "orion-nebula",
        "eagle-nebula"
      ]
    },
    {
      "id": "distances-in-space",
      "title": "Distances in space",
      "summary": "Astronomy depends on turning faintness, motion, and variable light into measures of scale.",
      "description": "Space is so large that everyday intuition fails quickly. Astronomers combine geometry, standard candles, and redshift-linked reasoning to estimate how far away objects truly are.",
      "pageHref": "pages/learn.html#path-distances-in-space",
      "tag": "Scale",
      "relatedObjectIds": [
        "proxima-centauri",
        "polaris",
        "andromeda-galaxy"
      ]
    },
    {
      "id": "sky-navigation",
      "title": "Constellations and sky navigation",
      "summary": "Patterns in the sky help people orient themselves and find deeper science targets.",
      "description": "Constellations are not physical clusters in most cases, but they are powerful navigation tools. They connect observation, culture, and practical skyfinding.",
      "pageHref": "pages/learn.html#path-sky-navigation",
      "tag": "Navigation",
      "relatedObjectIds": [
        "polaris",
        "betelgeuse",
        "rigel",
        "pleiades"
      ]
    },
    {
      "id": "how-astronomers-know",
      "title": "How astronomers know what they know",
      "summary": "Astronomy turns careful observation into testable scientific inference.",
      "description": "Astronomers combine light, motion, models, and repeated measurements. The goal is not guesswork but evidence-based inference that can be checked from many angles.",
      "pageHref": "pages/learn.html#path-how-astronomers-know",
      "tag": "Methods",
      "relatedObjectIds": [
        "sun",
        "polaris",
        "barnards-star",
        "sombrero-galaxy"
      ]
    }
  ],
  "learningPaths": [
    {
      "id": "understanding-starlight",
      "title": "Understanding starlight",
      "eyebrow": "Path 01",
      "summary": "Start with the central tool of astronomy: light itself.",
      "sections": [
        {
          "title": "Light is the messenger",
          "body": "Astronomers rarely touch the objects they study. Instead, they measure how much light arrives, what wavelengths it contains, and how that light changes over time. Those measurements become evidence about the source."
        },
        {
          "title": "Color hints at temperature",
          "body": "A star that looks blue-white usually has a hotter visible surface than one that appears orange-red. That color impression is not the whole story, but it offers a quick physical clue."
        },
        {
          "title": "Spectra turn color into detail",
          "body": "A spectrum spreads light into many wavelengths. Dark absorption lines and bright emission lines act like labels from atoms and molecules, revealing what material is present and under what conditions."
        }
      ],
      "relatedTopicIds": [
        "stellar-classification",
        "how-astronomers-know"
      ],
      "exampleObjectIds": [
        "sun",
        "sirius",
        "rigel"
      ]
    },
    {
      "id": "stellar-classification",
      "title": "How stars are classified",
      "eyebrow": "Path 02",
      "summary": "See how astronomers organize stars into a useful scientific language.",
      "sections": [
        {
          "title": "Why classification matters",
          "body": "Without a shared system, every star would be an isolated case. Spectral classes let astronomers compare stars by temperature, spectral features, and broad physical character."
        },
        {
          "title": "The OBAFGKM sequence",
          "body": "This famous sequence runs from the hottest blue stars to the coolest red ones. Each class has distinctive spectral signatures, not just a different visible hue."
        },
        {
          "title": "Luminosity classes add scale",
          "body": "A Roman numeral or descriptor can indicate whether a star is a compact main-sequence object, a giant, or a supergiant. That turns classification into a window on stellar structure and evolution."
        }
      ],
      "relatedTopicIds": [
        "understanding-starlight",
        "stellar-life-cycle"
      ],
      "exampleObjectIds": [
        "sirius",
        "vega",
        "betelgeuse",
        "rigel"
      ]
    },
    {
      "id": "stellar-life-cycle",
      "title": "The life cycle of stars",
      "eyebrow": "Path 03",
      "summary": "Follow stars from collapsing clouds to their final remnants.",
      "sections": [
        {
          "title": "Stars begin in clouds",
          "body": "Cold molecular clouds can fragment and collapse under gravity. As material falls inward, the center heats until a protostar forms and fusion becomes possible."
        },
        {
          "title": "Fusion brings long stability",
          "body": "During the main sequence, a star balances gravity against pressure from energy produced in the core. This stable stage usually lasts the majority of a star's life."
        },
        {
          "title": "Mass decides the ending",
          "body": "Sun-like stars swell into red giants and eventually leave white dwarfs. Massive stars burn fuel faster, build heavier elements, and can die in supernova explosions."
        }
      ],
      "relatedTopicIds": [
        "stellar-classification",
        "distances-in-space"
      ],
      "exampleObjectIds": [
        "sun",
        "betelgeuse",
        "orion-nebula",
        "eagle-nebula"
      ]
    },
    {
      "id": "distances-in-space",
      "title": "Distances in space",
      "eyebrow": "Path 04",
      "summary": "Build an intuition for the enormous scales astronomers measure.",
      "sections": [
        {
          "title": "Nearby space can be geometric",
          "body": "For nearby stars, astronomers can measure tiny shifts against background stars as Earth moves around the Sun. That method, parallax, anchors the lower end of the cosmic distance ladder."
        },
        {
          "title": "Brightness needs calibration",
          "body": "If astronomers know an object's true luminosity, they can compare that with how bright it appears and infer distance. Variable stars and some supernovae are powerful tools here."
        },
        {
          "title": "Large distances reshape perspective",
          "body": "A nebula may lie hundreds or thousands of light-years away, while a galaxy may sit millions of light-years beyond us. Distances do not just change brightness; they alter how we think about cosmic history."
        }
      ],
      "relatedTopicIds": [
        "how-astronomers-know",
        "sky-navigation"
      ],
      "exampleObjectIds": [
        "proxima-centauri",
        "polaris",
        "andromeda-galaxy"
      ]
    },
    {
      "id": "sky-navigation",
      "title": "Constellations and sky navigation",
      "eyebrow": "Path 05",
      "summary": "Use recognizable sky patterns as a doorway into deeper astronomy.",
      "sections": [
        {
          "title": "Constellations are maps, not necessarily families",
          "body": "The stars in a constellation can be at dramatically different distances. What makes them useful is not shared physics but shared position from our point of view on Earth."
        },
        {
          "title": "Asterisms guide the eye",
          "body": "Familiar shapes such as the Big Dipper or Summer Triangle help observers jump to other regions. They serve as practical navigation tools in the night sky."
        },
        {
          "title": "Navigation supports science",
          "body": "Once you can orient yourself, you can repeatedly observe the same stars, compare color and brightness, and connect textbook concepts to real sky positions."
        }
      ],
      "relatedTopicIds": [
        "distances-in-space",
        "understanding-starlight"
      ],
      "exampleObjectIds": [
        "polaris",
        "betelgeuse",
        "rigel",
        "pleiades"
      ]
    },
    {
      "id": "how-astronomers-know",
      "title": "How astronomers know what they know",
      "eyebrow": "Path 06",
      "summary": "See how observation becomes scientific confidence.",
      "sections": [
        {
          "title": "Evidence begins with measurement",
          "body": "Astronomers record brightness, spectra, motion, timing, and images. Those observations are repeatable, shareable, and often gathered across many observatories."
        },
        {
          "title": "Inference is grounded by models",
          "body": "A spectrum alone is not the end of the story. Astronomers compare observations with physical models of atoms, fusion, gravity, and radiation to test which explanations fit."
        },
        {
          "title": "Confidence grows by cross-checking",
          "body": "The strongest conclusions come when multiple methods agree: a star's temperature can be supported by both color and spectra, and its distance can be checked against several independent techniques."
        }
      ],
      "relatedTopicIds": [
        "understanding-starlight",
        "distances-in-space"
      ],
      "exampleObjectIds": [
        "sun",
        "polaris",
        "barnards-star",
        "sombrero-galaxy"
      ]
    }
  ],
  "startHere": {
    "title": "Start here",
    "description": "If you are brand new to astronomy, begin with light, then classification, then stellar lives. Once those foundations feel natural, scale and sky navigation become much easier.",
    "steps": [
      {
        "label": "Read how light works",
        "href": "pages/learn.html#path-understanding-starlight"
      },
      {
        "label": "See how stars are classified",
        "href": "pages/learn.html#path-stellar-classification"
      },
      {
        "label": "Follow the life cycle of stars",
        "href": "pages/learn.html#path-stellar-life-cycle"
      },
      {
        "label": "Practice with real objects",
        "href": "pages/explore.html"
      }
    ]
  }
};
