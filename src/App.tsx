import { useEffect, useState } from "react";

type Route = "home" | "portfolio" | "about" | "services" | "inquire";
const routeFromPath = (): Route => { const value = window.location.pathname.split("/").filter(Boolean)[0]; return (["portfolio", "about", "services", "inquire"] as Route[]).includes(value as Route) ? value as Route : "home"; };
const galleries = [
  { title: "Graduation", note: "The end of one chapter, held onto forever.", image: "/images/graduate-gown.jpg" },
  { title: "Portraits", note: "Honest portraits with room to feel like yourself.", image: "/images/portrait-field.jpg" },
  { title: "On film", note: "Soft edges, in-between moments, and a little nostalgia.", image: "/images/film-story-1.jpg" },
];

function App() {
  const [route, setRoute] = useState<Route>(routeFromPath);
  useEffect(() => { const update = () => setRoute(routeFromPath()); window.addEventListener("popstate", update); return () => window.removeEventListener("popstate", update); }, []);
  const navigate = (next: Route) => { window.history.pushState({}, "", next === "home" ? "/" : `/${next}`); setRoute(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goToHomepage = () => navigate("home");
  return <div className="site-shell"><Header route={route} onNavigate={navigate} onHome={goToHomepage} /><main id="main">{route === "home" && <Home onNavigate={navigate} />}{route === "portfolio" && <Portfolio onNavigate={navigate} />}{route === "about" && <About onNavigate={navigate} />}{route === "services" && <Services onNavigate={navigate} />}{route === "inquire" && <Inquire />}</main><Footer onNavigate={navigate} /></div>;
}

function Header({ route, onNavigate, onHome }: { route: Route; onNavigate: (route: Route) => void; onHome: () => void }) {
  return <header className="site-header"><button className="wordmark" onClick={onHome} aria-label="Christy Ho Photography, homepage"><span>Christy Ho</span><small>Photography</small></button><nav aria-label="Main navigation">{(["portfolio", "about", "services", "inquire"] as Route[]).map((item) => <button className={route === item ? "active" : ""} key={item} onClick={() => onNavigate(item)}>{item}</button>)}</nav></header>;
}

function Home({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return <><section className="hero-collage" aria-label="Selected photography"><figure className="hero-left"><img src="/images/portrait-field.jpg" alt="Portrait in a green field" /></figure><figure className="hero-center"><img src="/images/graduate-gown.jpg" alt="Graduation portrait" /></figure><figure className="hero-right"><img src="/images/film-story-2.jpg" alt="Black and white film photograph" /></figure><figure className="hero-detail"><img src="/images/portrait-close.jpg" alt="Close portrait detail" /></figure><figure className="hero-film"><img src="/images/film-story-1.jpg" alt="Film photograph" /></figure><img className="decor decor-lace-hero" src="/decor/heirloom-lace-frame.png" alt="" aria-hidden="true" /><img className="decor decor-ribbon-hero" src="/decor/silk-ribbon-tag.png" alt="" aria-hidden="true" /><div className="hero-copy"><p className="kicker">Christy Ho Photography</p><h1>Christy is a <em>portrait</em> &amp; <em>graduation photographer</em> creating honest imagery for meaningful seasons.</h1><p className="hero-intro">California based · available for personal stories and creative commissions.</p><TextLink onClick={() => onNavigate("portfolio")}>View selected work</TextLink></div><div className="hero-meta"><span>California</span><span>Selected work · 2024—26</span><span>Scroll ↓</span></div></section>
  <section className="intro-section tactile-section"><img className="decor decor-flowers-intro" src="/decor/pressed-wildflowers.png" alt="" aria-hidden="true" /><p className="section-number">01 / The heart of it</p><div><h2>Your story deserves to be remembered <em>as it felt.</em></h2><p className="body-large">The loud laughs, the quiet pauses, and every beautiful in-between. I create warm, artful photographs that let you return to this season again and again.</p><TextLink onClick={() => onNavigate("about")}>Meet Christy</TextLink></div></section>
  <section className="gallery-section"><div className="center-heading"><p className="kicker">A glimpse into the stories</p><h2>Recent <em>work</em></h2></div><GalleryCards /><TextLink onClick={() => onNavigate("portfolio")}>Explore the portfolio</TextLink></section>
  <section className="experience-banner"><img src="/images/portrait-walk.jpg" alt="Portrait session in motion" /><div><p className="kicker">More than photographs</p><h2>A relaxed, thoughtful <em>experience</em></h2><p>From our first conversation through your final gallery, I’ll help create a session that feels comfortable, personal, and unmistakably yours.</p><TextLink light onClick={() => onNavigate("services")}>View services</TextLink></div></section>
  <section className="closing-cta"><p className="script-accent">Let’s make something honest</p><h2>Ready to tell your story?</h2><button className="oval-button" onClick={() => onNavigate("inquire")}>Begin here</button></section></>;
}

function GalleryCards() { return <div className="gallery-cards">{galleries.map((gallery, index) => <article key={gallery.title} className={`gallery-card card-${index + 1}`}><img src={gallery.image} alt={`${gallery.title} photography`} /><p className="kicker">Collection {String(index + 1).padStart(2, "0")}</p><h3>{gallery.title}</h3><p>{gallery.note}</p></article>)}</div>; }

function arrangeSessionPhoto(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  const photo = image.parentElement;
  if (!photo) return;
  photo.classList.toggle("is-landscape", image.naturalWidth > image.naturalHeight);
  const measure = () => { photo.style.gridRowEnd = `span ${Math.ceil((image.getBoundingClientRect().height + 14) / 15)}`; };
  requestAnimationFrame(measure);
  if (!photo.dataset.masonryObserved) {
    new ResizeObserver(measure).observe(image);
    photo.dataset.masonryObserved = "true";
  }
}

function Portfolio({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const [filter, setFilter] = useState("All");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const sessions = [
    { slug: "sam-graduation", title: "Sam Graduation", category: "Digital", count: 11, note: "A graduation story filled with campus light and movement." },
    { slug: "fufu-graduation", title: "FUFU Graduation", category: "Digital", count: 8, note: "A celebratory graduation session with warm, natural portraits." },
    { slug: "noelle", title: "Noelle", category: "Digital", count: 7, note: "An expressive portrait session shaped by place and personality." },
    { slug: "self-portraits", title: "Self-Portraits", category: "Digital", count: 7, note: "Personal studies in gesture, light, and self-observation." },
    { slug: "bw-photobooth", title: "B&W Photobooth", category: "Film", count: 7, note: "A playful black-and-white sequence made one frame at a time." },
    { slug: "film-with-people", title: "Film — With People", category: "Film", count: 4, note: "Candid color film photographs of people and shared moments." },
    { slug: "film-without-people", title: "Film — Without People", category: "Film", count: 4, note: "Quiet observations of light, landscape, and everyday details." },
  ];
  const filters = ["All", "Digital", "Film"];
  const visible = filter === "All" ? sessions : sessions.filter((session) => session.category === filter);
  const active = sessions.find((session) => session.slug === selectedSession);
  const images = active ? Array.from({ length: active.count }, (_, index) => `/sessions/${active.slug}/${String(index + 1).padStart(2, "0")}.jpg`) : [];
  const showAdjacent = (direction: number) => setLightbox((current) => {
    if (!current || !images.length) return current;
    const currentIndex = images.indexOf(current);
    return images[(currentIndex + direction + images.length) % images.length];
  });
  useEffect(() => {
    const navigateLightbox = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (lightbox && event.key === "ArrowLeft") showAdjacent(-1);
      if (lightbox && event.key === "ArrowRight") showAdjacent(1);
    };
    window.addEventListener("keydown", navigateLightbox);
    return () => window.removeEventListener("keydown", navigateLightbox);
  }, [lightbox, selectedSession]);
  if (active) {
    return <section className="session-page"><button className="session-back" onClick={() => setSelectedSession(null)}>← All sessions</button><header className="session-header"><div><p className="kicker">{active.category} session · {active.count} photographs</p><h1>{active.title}</h1></div><p>{active.note}</p></header><div className="session-gallery">{images.map((image, index) => <button className="session-photo" key={image} onClick={() => setLightbox(image)} aria-label={`Enlarge ${active.title} photograph ${index + 1}`}><img src={image} alt={`${active.title}, photograph ${index + 1}`} loading={index > 5 ? "lazy" : "eager"} onLoad={arrangeSessionPhoto} /></button>)}</div><div className="portfolio-end"><button onClick={() => setSelectedSession(null)}>← Return to sessions</button><button onClick={() => onNavigate("inquire")}>Inquire about a session ↗</button></div>{lightbox && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged photograph" onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close enlarged photograph">Close ×</button><button className="lightbox-nav lightbox-prev" onClick={(event) => { event.stopPropagation(); showAdjacent(-1); }} aria-label="Previous photograph">←</button><img src={lightbox} alt={`${active.title}, enlarged view`} onClick={(event) => event.stopPropagation()} /><button className="lightbox-nav lightbox-next" onClick={(event) => { event.stopPropagation(); showAdjacent(1); }} aria-label="Next photograph">→</button></div>}</section>;
  }
  return <section className="portfolio-index"><header className="portfolio-heading"><div><p className="kicker">Photography archive</p><h1>Sessions</h1></div><p>Each collection is one complete session. Open a story to view the photographs together in a multi-column sequence.</p></header><div className="portfolio-filters" aria-label="Filter sessions">{filters.map((item) => <button className={filter === item ? "active" : ""} aria-pressed={filter === item} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="session-index">{visible.map((session, index) => <button className="session-card" key={session.slug} onClick={() => { setSelectedSession(session.slug); window.scrollTo({ top: 0, behavior: "smooth" }); }}><div className="session-cover"><img src={`/sessions/${session.slug}/01.jpg`} alt={`${session.title} session cover`} /></div><div className="session-card-copy"><span>{String(index + 1).padStart(2, "0")}</span><h2>{session.title}</h2><p>{session.category} · {session.count} photographs</p></div></button>)}</div><div className="portfolio-end"><p>{sessions.length} complete sessions</p><button onClick={() => onNavigate("inquire")}>Inquire about a session ↗</button></div></section>;
}

function About({ onNavigate }: { onNavigate: (route: Route) => void }) { return <section className="editorial-page tactile-page"><img className="decor decor-flowers-about" src="/decor/pressed-wildflowers.png" alt="" aria-hidden="true" /><PageIntro eyebrow="Behind the lens" title={<>Hi, I’m <em>Christy.</em></>} text="A photographer drawn to honest expression, thoughtful details, and images with a sense of place." /><div className="about-story"><img src="/images/christy-portrait.jpg" alt="Portrait of photographer Christy Ho" /><div><p className="section-number">A little about me</p><h2>I notice the moments between the <em>moments.</em></h2><p className="body-large">My approach is calm and collaborative. I’ll offer enough direction to help you feel at ease, then leave room for your personality and natural movement to lead.</p><p>Whether we’re celebrating a graduation, making portraits just because, or documenting a new creative chapter, the goal is the same: photographs that feel true to you.</p><TextLink onClick={() => onNavigate("services")}>See the services</TextLink></div></div></section>; }

function Services({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [["What kinds of sessions do you photograph?", "Christy Ho Photography currently focuses on graduation, individual portraits, creative editorials, and personal storytelling sessions."], ["What happens after I inquire?", "We’ll talk through your vision, timing, location, and what you want the images to feel like before shaping the session together."], ["I feel awkward in front of the camera—can you help?", "Absolutely. You’ll receive gentle direction and simple prompts, with plenty of space to move, breathe, and settle into the experience."], ["When will I receive my photographs?", "Your exact delivery timing will be confirmed in your proposal and agreement before booking."]];
  return <section className="editorial-page tactile-page"><img className="decor decor-lace-services" src="/decor/heirloom-lace-frame.png" alt="" aria-hidden="true" /><PageIntro eyebrow="Services" title={<>Photography for the moments worth <em>remembering.</em></>} text="A personal, easygoing process designed around your story—not a one-size-fits-all formula." /><div className="offer-grid"><article><img src="/images/graduate-campus.jpg" alt="Graduation photography session" /><span>01</span><h2>Graduation</h2><p>Celebrate the work, the place, and the people who shaped this chapter. Sessions can include campus landmarks, cap and gown portraits, and the small details you’ll want to remember.</p></article><article><img src="/images/portrait-close.jpg" alt="Individual portrait session" /><span>02</span><h2>Portraits</h2><p>For personal milestones, creative profiles, or simply marking who you are right now. We’ll build a session around your personality, location, and visual ideas.</p></article><article><img src="/images/film-story-3.jpg" alt="Creative film photography" /><span>03</span><h2>Creative stories</h2><p>A more exploratory session for artists, makers, and anyone with a concept that deserves room to unfold through digital and film-inspired imagery.</p></article></div>
  <section className="process-section"><p className="kicker">Simple from start to finish</p><h2>The booking <em>process</em></h2><div className="process-grid"><article><span>01</span><h3>Say hello</h3><p>Tell me about your idea, preferred date, and what matters most to you.</p></article><article><span>02</span><h3>Shape the session</h3><p>We’ll choose the setting, timing, styling, and details together.</p></article><article><span>03</span><h3>Make the memories</h3><p>Show up as you are. I’ll guide the experience and photograph the rest.</p></article></div><button className="oval-button" onClick={() => onNavigate("inquire")}>Work with me</button></section>
  <section className="faq-section"><p className="kicker">Good to know</p><h2>Common <em>questions</em></h2><div className="faq-list">{faqs.map(([question, answer], index) => <article key={question}><button aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{question}</span><b>{openFaq === index ? "−" : "+"}</b></button>{openFaq === index && <p>{answer}</p>}</article>)}</div></section></section>;
}

function Inquire() { return <section className="editorial-page inquire-page tactile-page"><img className="decor decor-flowers-inquire" src="/decor/pressed-wildflowers.png" alt="" aria-hidden="true" /><img className="decor decor-ribbon-inquire" src="/decor/silk-ribbon-tag.png" alt="" aria-hidden="true" /><PageIntro eyebrow="Let’s connect" title={<>Tell me what you’re <em>dreaming up.</em></>} text="Share as much as you can below. This form is currently a design preview and will be connected before launch." /><form onSubmit={(event) => event.preventDefault()}><label>Your name<input name="name" autoComplete="name" /></label><label>Email address<input name="email" type="email" autoComplete="email" /></label><label>Session type<select name="session"><option>Graduation</option><option>Portrait</option><option>Creative story</option><option>Something else</option></select></label><label>Preferred date<input name="date" type="date" /></label><label className="full">Tell me about your vision<textarea name="message" rows={6} /></label><button className="oval-button" type="submit">Send inquiry</button></form></section>; }

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: React.ReactNode; text: string }) { return <header className="page-intro"><p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{text}</p></header>; }
function TextLink({ children, onClick, light = false }: { children: React.ReactNode; onClick: () => void; light?: boolean }) { return <button className={`text-link${light ? " light" : ""}`} onClick={onClick}><span>{children}</span><b aria-hidden="true">↗</b></button>; }
function Footer({ onNavigate }: { onNavigate: (route: Route) => void }) { return <footer><div className="footer-brand"><span>Christy Ho</span><small>Photography</small></div><div className="footer-links"><p className="kicker">Navigate</p>{(["portfolio", "about", "services", "inquire"] as Route[]).map((route) => <button key={route} onClick={() => onNavigate(route)}>{route}</button>)}</div><div className="footer-note"><p className="script-accent">Stay close</p><p>Portraits, milestones, and honest stories.</p></div><p className="copyright">© {new Date().getFullYear()} Christy Ho Photography</p></footer>; }

export default App;
