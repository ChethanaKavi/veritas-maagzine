export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  magazineId: string;
  author: string;
  date: string;
  readTime: string;
  active?: boolean;
}

export interface Magazine {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  issue: string;
  date: string;
  active?: boolean;
}

export interface Advertisement {
  id: string;
  topic: string;
  description: string;
  image: string;
  area: "sidebar" | "top-banner" | "bottom-strip" | "inline-content";
  link: string;
}

export const magazines: Magazine[] = [
  {
    id: '1',
    title: 'Tech Innovator',
    description: 'Exploring the latest technological breakthroughs and innovations shaping our digital future. From AI to quantum computing, we cover it all.',
    coverImage: 'https://picsum.photos/seed/tech-mag/400/600',
    issue: 'March 2026',
    date: 'March 1, 2026',
    active: true,
  },
  {
    id: '2',
    title: 'Business Quarterly',
    description: 'In-depth analysis of market trends, leadership strategies, and success stories from the world of business and entrepreneurship.',
    coverImage: 'https://picsum.photos/seed/biz-mag/400/600',
    issue: 'February 2026',
    date: 'February 1, 2026',
    active: true,
  },
  {
    id: '3',
    title: 'Fashion Forward',
    description: 'The ultimate guide to contemporary style, runway trends, and the designers defining the future of fashion.',
    coverImage: 'https://picsum.photos/seed/fashion-mag/400/600',
    issue: 'January 2026',
    date: 'January 15, 2026',
    active: true,
  },
  {
    id: '4',
    title: 'Nature & Wildlife',
    description: 'Stunning photography and compelling stories from the natural world, celebrating Earth\'s incredible biodiversity.',
    coverImage: 'https://picsum.photos/seed/nature-mag/400/600',
    issue: 'December 2025',
    date: 'December 20, 2025',
    active: true,
  },
  {
    id: '5',
    title: 'Travel Explorer',
    description: 'Discover hidden destinations, cultural experiences, and adventure travel stories from around the globe.',
    coverImage: 'https://picsum.photos/seed/travel-mag/400/600',
    issue: 'November 2025',
    date: 'November 10, 2025',
    active: true,
  },
  {
    id: '6',
    title: 'Culinary Arts',
    description: 'Celebrating the art of cooking with recipes, chef interviews, and the latest trends in food and beverage.',
    coverImage: 'https://picsum.photos/seed/food-mag/400/600',
    issue: 'October 2025',
    date: 'October 5, 2025',
    active: true,
  },
];

export const articles: Article[] = [
  // Tech Innovator Articles (Magazine ID: 1)
  {
    id: 'a1',
    title: 'The Future of AI: Beyond Machine Learning',
    excerpt: 'Artificial Intelligence is evolving rapidly. Discover how next-generation AI systems are reshaping industries and our daily lives.',
    content: `
      <h2>Introduction</h2>
      <p>Artificial Intelligence has come a long way from simple rule-based systems. Today, we stand at the threshold of a new era where AI systems can reason, create, and adapt in ways we never thought possible.</p>
      
      <h2>The Evolution of AI</h2>
      <p>Machine learning revolutionized how computers learn from data. But the next generation of AI goes beyond pattern recognition. These systems can understand context, generate creative solutions, and even explain their reasoning.</p>
      
      <h2>Real-World Applications</h2>
      <p>From healthcare diagnostics to climate modeling, AI is tackling some of humanity's biggest challenges. Medical AI can now detect diseases earlier than human doctors, while climate AI helps predict environmental changes with unprecedented accuracy.</p>
      
      <h2>Ethical Considerations</h2>
      <p>As AI becomes more powerful, we must address important ethical questions. How do we ensure AI systems are fair, transparent, and aligned with human values? These questions will define the future of AI development.</p>
      
      <h2>Conclusion</h2>
      <p>The future of AI is not just about smarter machines—it's about creating systems that enhance human potential while respecting our values and diversity.</p>
    `,
    image: 'https://picsum.photos/seed/tech-art/800/500',
    magazineId: '1',
    author: 'Dr. Sarah Chen',
    date: 'March 5, 2026',
    readTime: '8 min read',
  },
  {
    id: 'a2',
    title: 'Quantum Computing: The Next Revolution',
    excerpt: 'Quantum computers promise to solve problems that are impossible for classical computers. Here\'s what you need to know.',
    content: `
      <h2>Understanding Quantum Computing</h2>
      <p>Unlike classical computers that use bits, quantum computers use quantum bits or qubits. These qubits can exist in multiple states simultaneously, enabling unprecedented computational power.</p>
      
      <h2>Breaking New Ground</h2>
      <p>Recent breakthroughs have brought quantum computing closer to practical applications. From drug discovery to cryptography, the potential applications are transformative.</p>
      
      <h2>Challenges Ahead</h2>
      <p>Despite progress, quantum computers are still fragile and error-prone. Maintaining quantum states requires extreme conditions, and scaling up remains a significant challenge.</p>
      
      <h2>The Road Forward</h2>
      <p>As technology advances, we're getting closer to quantum advantage—the point where quantum computers outperform classical ones on practical problems.</p>
    `,
    image: 'https://picsum.photos/seed/tech-art/800/500',
    magazineId: '1',
    author: 'Prof. Michael Park',
    date: 'March 3, 2026',
    readTime: '10 min read',
  },
  {
    id: 'a3',
    title: 'Sustainable Tech: Green Innovation for Tomorrow',
    excerpt: 'Technology companies are leading the charge in sustainability. Learn about the innovations making tech greener.',
    content: `
      <h2>The Environmental Challenge</h2>
      <p>The tech industry's carbon footprint is significant. Data centers alone consume enormous amounts of energy. But innovation is driving change.</p>
      
      <h2>Green Data Centers</h2>
      <p>Modern data centers are becoming increasingly efficient. From renewable energy to advanced cooling systems, the industry is transforming how it operates.</p>
      
      <h2>Sustainable Hardware</h2>
      <p>Device manufacturers are rethinking their approach to materials and recycling. Modular designs and recyclable components are becoming the norm.</p>
      
      <h2>Software Efficiency</h2>
      <p>Even software can be greener. Optimized code and efficient algorithms reduce energy consumption across billions of devices.</p>
    `,
    image: 'https://picsum.photos/seed/tech-art/800/500',
    magazineId: '1',
    author: 'Emma Rodriguez',
    date: 'March 1, 2026',
    readTime: '6 min read',
  },

  // Business Quarterly Articles (Magazine ID: 2)
  {
    id: 'a4',
    title: 'Leadership in the Digital Age',
    excerpt: 'Modern leadership requires new skills and approaches. Discover what makes great leaders in today\'s digital world.',
    content: `
      <h2>The Changing Face of Leadership</h2>
      <p>Digital transformation has fundamentally changed how organizations operate. Leaders must now navigate remote teams, digital tools, and rapid change.</p>
      
      <h2>Essential Digital Leadership Skills</h2>
      <p>Today's leaders need technical literacy, adaptability, and emotional intelligence. Understanding technology is no longer optional—it's essential.</p>
      
      <h2>Building Remote-First Culture</h2>
      <p>The shift to remote and hybrid work has challenged traditional leadership models. Successful leaders are creating new ways to build trust and collaboration.</p>
      
      <h2>Leading Through Change</h2>
      <p>Change is constant in the digital age. Great leaders help their teams embrace change rather than resist it.</p>
    `,
    image: 'https://picsum.photos/seed/biz-art/800/500',
    magazineId: '2',
    author: 'James Mitchell',
    date: 'February 25, 2026',
    readTime: '7 min read',
  },
  {
    id: 'a5',
    title: 'Market Trends: What to Watch in 2026',
    excerpt: 'Economic indicators point to significant shifts in global markets. Here\'s what investors and business leaders should know.',
    content: `
      <h2>Global Economic Overview</h2>
      <p>The global economy is entering a new phase. Emerging markets are gaining strength while traditional powerhouses face new challenges.</p>
      
      <h2>Technology Sector Outlook</h2>
      <p>Tech continues to drive market growth, but investors are becoming more selective. Profitability is now as important as growth.</p>
      
      <h2>Sustainability as Investment Driver</h2>
      <p>ESG investing is no longer a niche. Companies with strong sustainability practices are outperforming their peers.</p>
      
      <h2>Opportunities and Risks</h2>
      <p>While opportunities abound, geopolitical tensions and regulatory changes present risks that savvy investors must navigate.</p>
    `,
    image: 'https://picsum.photos/seed/biz-art/800/500',
    magazineId: '2',
    author: 'Rachel Thompson',
    date: 'February 20, 2026',
    readTime: '9 min read',
  },
  {
    id: 'a6',
    title: 'Startup Success Stories: Lessons from Unicorns',
    excerpt: 'What makes some startups succeed while others fail? We analyze the journeys of recent unicorn companies.',
    content: `
      <h2>The Unicorn Phenomenon</h2>
      <p>In recent years, we've seen an unprecedented number of startups reach billion-dollar valuations. But what sets these companies apart?</p>
      
      <h2>Key Success Factors</h2>
      <p>Successful startups share common traits: solving real problems, executing flawlessly, and adapting quickly to market feedback.</p>
      
      <h2>Learning from Failures</h2>
      <p>For every unicorn, there are countless startups that don't make it. Understanding why companies fail is just as important as understanding success.</p>
      
      <h2>Advice for Founders</h2>
      <p>Industry veterans share their insights on building sustainable, scalable businesses in competitive markets.</p>
    `,
    image: 'https://picsum.photos/seed/biz-art/800/500',
    magazineId: '2',
    author: 'Kevin Zhang',
    date: 'February 15, 2026',
    readTime: '11 min read',
  },

  // Fashion Forward Articles (Magazine ID: 3)
  {
    id: 'a7',
    title: 'Spring 2026 Runway Highlights',
    excerpt: 'From Paris to Milan, the Spring 2026 collections showcase bold colors, sustainable materials, and innovative designs.',
    content: `
      <h2>The Season's Defining Trends</h2>
      <p>Spring 2026 runways revealed a fashion landscape that balances sustainability with bold creative expression.</p>
      
      <h2>Sustainable Luxury</h2>
      <p>Major fashion houses are proving that luxury and sustainability can coexist. Innovative materials and ethical production are now industry standards.</p>
      
      <h2>Color Palette</h2>
      <p>Vibrant greens, soft pastels, and bold reds dominated the runways. Designers are embracing color as a form of optimism and self-expression.</p>
      
      <h2>Standout Designers</h2>
      <p>This season's breakout designers are reimagining traditional silhouettes with modern techniques and sustainable practices.</p>
    `,
    image: 'https://picsum.photos/seed/fashion-art/800/500',
    magazineId: '3',
    author: 'Isabella Moreau',
    date: 'January 28, 2026',
    readTime: '8 min read',
  },
  {
    id: 'a8',
    title: 'The Rise of Digital Fashion',
    excerpt: 'Virtual clothing and digital fashion shows are transforming the industry. Explore this growing trend.',
    content: `
      <h2>Fashion Meets Technology</h2>
      <p>Digital fashion is no longer a novelty—it's a billion-dollar industry that's reshaping how we think about clothing.</p>
      
      <h2>Virtual Wardrobes</h2>
      <p>From social media to gaming, digital clothing allows people to express their style in virtual spaces without environmental impact.</p>
      
      <h2>NFT Fashion</h2>
      <p>Blockchain technology is enabling ownership of unique digital fashion pieces, creating new revenue streams for designers.</p>
      
      <h2>The Future of Fashion</h2>
      <p>As virtual and physical worlds merge, fashion will exist seamlessly across both realms.</p>
    `,
    image: 'https://picsum.photos/seed/fashion-art/800/500',
    magazineId: '3',
    author: 'Marcus Lee',
    date: 'January 22, 2026',
    readTime: '7 min read',
  },
  {
    id: 'a9',
    title: 'Timeless Wardrobe Essentials',
    excerpt: 'Build a sustainable closet with pieces that never go out of style. Quality over quantity is the new luxury.',
    content: `
      <h2>The Case for Timeless Fashion</h2>
      <p>In an era of fast fashion, investing in timeless pieces is both economical and environmentally responsible.</p>
      
      <h2>Essential Pieces</h2>
      <p>Every wardrobe needs certain foundational pieces: the perfect white shirt, well-fitted jeans, and a quality blazer.</p>
      
      <h2>Quality Indicators</h2>
      <p>Learn to recognize quality craftsmanship, from stitching to fabric choice. These details determine how long a piece will last.</p>
      
      <h2>Building Your Collection</h2>
      <p>Start with versatile neutrals, then add statement pieces that reflect your personal style.</p>
    `,
    image: 'https://picsum.photos/seed/fashion-art/800/500',
    magazineId: '3',
    author: 'Sophia Anderson',
    date: 'January 18, 2026',
    readTime: '6 min read',
  },

  // Nature & Wildlife Articles (Magazine ID: 4)
  {
    id: 'a10',
    title: 'Arctic Wildlife: Adapting to Climate Change',
    excerpt: 'Polar species face unprecedented challenges as Arctic ice melts. Discover how wildlife is adapting to rapid environmental change.',
    content: `
      <h2>The Changing Arctic</h2>
      <p>The Arctic is warming twice as fast as the global average, forcing wildlife to adapt or face extinction.</p>
      
      <h2>Polar Bear Challenges</h2>
      <p>With sea ice disappearing, polar bears must travel farther to hunt. Some populations are showing concerning signs of stress.</p>
      
      <h2>Unexpected Adaptations</h2>
      <p>Some species are showing remarkable resilience, changing their behavior and diet in response to environmental shifts.</p>
      
      <h2>Conservation Efforts</h2>
      <p>Scientists and conservationists are working to protect Arctic ecosystems and help wildlife adapt to a changing world.</p>
    `,
    image: 'https://picsum.photos/seed/nature-art/800/500',
    magazineId: '4',
    author: 'Dr. Laura Winters',
    date: 'December 28, 2025',
    readTime: '9 min read',
  },
  {
    id: 'a11',
    title: 'Amazon Rainforest: The World\'s Lungs',
    excerpt: 'Explore the incredible biodiversity of the Amazon and the urgent need to protect this vital ecosystem.',
    content: `
      <h2>Biodiversity Hotspot</h2>
      <p>The Amazon hosts more species than any other terrestrial ecosystem on Earth. Every acre contains countless undiscovered organisms.</p>
      
      <h2>Ecosystem Services</h2>
      <p>Beyond biodiversity, the Amazon regulates global climate, produces oxygen, and stores massive amounts of carbon.</p>
      
      <h2>Threats to the Forest</h2>
      <p>Deforestation, fires, and climate change threaten the Amazon. Scientists warn we may be approaching an irreversible tipping point.</p>
      
      <h2>Hope for the Future</h2>
      <p>Indigenous communities and conservation organizations are leading efforts to protect and restore the rainforest.</p>
    `,
    image: 'https://picsum.photos/seed/nature-art/800/500',
    magazineId: '4',
    author: 'Carlos Rivera',
    date: 'December 22, 2025',
    readTime: '10 min read',
  },
  {
    id: 'a12',
    title: 'Ocean Giants: The Secret Lives of Whales',
    excerpt: 'New research reveals surprising intelligence and complex social structures in whale populations worldwide.',
    content: `
      <h2>Whale Intelligence</h2>
      <p>Recent studies show whales possess remarkable cognitive abilities, including complex communication and problem-solving skills.</p>
      
      <h2>Social Structures</h2>
      <p>Whale pods function as sophisticated societies with learned behaviors passed down through generations.</p>
      
      <h2>Communication Systems</h2>
      <p>Whale songs are far more complex than previously thought, potentially containing syntax and cultural information.</p>
      
      <h2>Conservation Success</h2>
      <p>Some whale populations are recovering thanks to international protection efforts, proving conservation works.</p>
    `,
    image: 'https://picsum.photos/seed/nature-art/800/500',
    magazineId: '4',
    author: 'Dr. Marina Okazaki',
    date: 'December 20, 2025',
    readTime: '8 min read',
  },

  // Travel Explorer Articles (Magazine ID: 5)
  {
    id: 'a13',
    title: 'Hidden Gems of Southeast Asia',
    excerpt: 'Venture beyond the tourist trail to discover lesser-known destinations offering authentic cultural experiences.',
    content: `
      <h2>Beyond the Beaten Path</h2>
      <p>While millions flock to Bangkok and Bali, Southeast Asia's true treasures lie in its lesser-known destinations.</p>
      
      <h2>Luang Prabang, Laos</h2>
      <p>This UNESCO World Heritage site offers serene temples, French colonial architecture, and stunning natural beauty.</p>
      
      <h2>Palawan, Philippines</h2>
      <p>Crystal-clear waters, limestone cliffs, and vibrant marine life make Palawan a paradise for nature lovers.</p>
      
      <h2>Sustainable Travel Tips</h2>
      <p>Learn how to explore these destinations while supporting local communities and minimizing environmental impact.</p>
    `,
    image: 'https://picsum.photos/seed/travel-art/800/500',
    magazineId: '5',
    author: 'Maya Patel',
    date: 'November 18, 2025',
    readTime: '7 min read',
  },
  {
    id: 'a14',
    title: 'European Road Trip: The Ultimate Guide',
    excerpt: 'Plan the perfect European road trip with our comprehensive guide to routes, destinations, and essential tips.',
    content: `
      <h2>Planning Your Journey</h2>
      <p>A European road trip offers unparalleled freedom to explore diverse cultures, landscapes, and cuisines.</p>
      
      <h2>Classic Routes</h2>
      <p>From the Italian coastline to Scottish Highlands, discover routes that showcase Europe's incredible diversity.</p>
      
      <h2>Hidden Stops</h2>
      <p>The best road trips include serendipitous discoveries. We share insider tips for finding hidden gems along the way.</p>
      
      <h2>Practical Advice</h2>
      <p>Navigation, parking, tolls, and border crossings—everything you need to know for a smooth journey.</p>
    `,
    image: 'https://picsum.photos/seed/travel-art/800/500',
    magazineId: '5',
    author: 'Thomas Mueller',
    date: 'November 12, 2025',
    readTime: '11 min read',
  },
  {
    id: 'a15',
    title: 'Solo Travel: Finding Yourself Around the World',
    excerpt: 'Solo travel can be transformative. Learn how to plan safe, enriching solo adventures.',
    content: `
      <h2>The Solo Travel Experience</h2>
      <p>Traveling alone teaches self-reliance, builds confidence, and offers unique opportunities for personal growth.</p>
      
      <h2>Safety First</h2>
      <p>Practical tips for staying safe while traveling solo, from choosing accommodations to navigating unfamiliar cities.</p>
      
      <h2>Meeting People</h2>
      <p>Solo doesn't mean lonely. Discover how to connect with locals and fellow travelers for meaningful experiences.</p>
      
      <h2>Best Destinations</h2>
      <p>Some destinations are particularly welcoming for solo travelers. We highlight the best options for first-timers.</p>
    `,
    image: 'https://picsum.photos/seed/travel-art/800/500',
    magazineId: '5',
    author: 'Elena Kowalski',
    date: 'November 10, 2025',
    readTime: '8 min read',
  },

  // Culinary Arts Articles (Magazine ID: 6)
  {
    id: 'a16',
    title: 'Farm-to-Table: The Movement Reshaping Dining',
    excerpt: 'Restaurants are forging direct relationships with farmers, creating fresher, more sustainable menus.',
    content: `
      <h2>The Farm-to-Table Philosophy</h2>
      <p>This movement goes beyond fresh ingredients—it's about sustainability, seasonality, and supporting local agriculture.</p>
      
      <h2>Chef Perspectives</h2>
      <p>Leading chefs explain how working directly with farmers has transformed their cooking and menus.</p>
      
      <h2>Environmental Impact</h2>
      <p>Reducing food miles and supporting sustainable farming practices benefits both diners and the planet.</p>
      
      <h2>Finding Farm-to-Table</h2>
      <p>How to identify authentic farm-to-table restaurants and support this important movement.</p>
    `,
    image: 'https://picsum.photos/seed/culinary-art/800/500',
    magazineId: '6',
    author: 'Chef Antoine Dubois',
    date: 'October 15, 2025',
    readTime: '7 min read',
  },
  {
    id: 'a17',
    title: 'Global Street Food: Authentic Flavors',
    excerpt: 'From Bangkok to Mexico City, street food offers the most authentic taste of local cuisine.',
    content: `
      <h2>Street Food Culture</h2>
      <p>Street food represents the soul of a city's culinary traditions, passed down through generations.</p>
      
      <h2>Must-Try Destinations</h2>
      <p>We tour the world's best street food cities, from Singapore's hawker centers to Istanbul's food markets.</p>
      
      <h2>Safety and Hygiene</h2>
      <p>How to enjoy street food safely while traveling, including tips for identifying quality vendors.</p>
      
      <h2>Signature Dishes</h2>
      <p>Iconic street foods you must try, from Vietnamese banh mi to Mexican tacos al pastor.</p>
    `,
    image: 'https://picsum.photos/seed/culinary-art/800/500',
    magazineId: '6',
    author: 'Priya Sharma',
    date: 'October 10, 2025',
    readTime: '9 min read',
  },
  {
    id: 'a18',
    title: 'Plant-Based Revolution: Beyond Meat Alternatives',
    excerpt: 'Innovative chefs are elevating plant-based cuisine beyond simple meat substitutes to create extraordinary dishes.',
    content: `
      <h2>New Plant-Based Paradigm</h2>
      <p>Modern plant-based cooking celebrates vegetables for what they are, not what they can mimic.</p>
      
      <h2>Innovative Techniques</h2>
      <p>Fermentation, smoking, and other techniques create complex flavors and textures in plant-based dishes.</p>
      
      <h2>Nutritional Benefits</h2>
      <p>Well-planned plant-based diets offer numerous health benefits while reducing environmental impact.</p>
      
      <h2>Restaurant Highlights</h2>
      <p>Leading plant-based restaurants proving that vegetables can be the star of fine dining.</p>
    `,
    image: 'https://picsum.photos/seed/culinary-art/800/500',
    magazineId: '6',
    author: 'Marcus Green',
    date: 'October 5, 2025',
    readTime: '8 min read',
  },
];

export const advertisements: Advertisement[] = [
  {
    id: 'ad1',
    topic: 'Tech Conference 2026',
    description: 'Join us for the largest tech event of the year. Early bird tickets available now.',
    image: 'https://picsum.photos/seed/event-art/800/500',
    area: 'top-banner',
    link: '#',
  },
  {
    id: 'ad2',
    topic: 'Luxury Watches',
    description: 'Eleganace reinvented. Discover our new collection of premium timepieces.',
    image: 'https://picsum.photos/seed/watch-art/800/500',
    area: 'sidebar',
    link: '#',
  }
];
