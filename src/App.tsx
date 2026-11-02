import { useEffect, useState } from "react";
import { collections } from "./data/site";

type Route = "home" | "portfolio" | "about" | "services" | "contact";

const routeFromPath = (): Route => {
  const route = window.location.pathname.split("/").filter(Boolean)[0];
  return (["portfolio", "about", "services", "contact"] as Route[]).includes(route as Route)
    ? (route as Route)
    : "home";
};

function App() {
  const [route, setRoute] = useState<Route>(routeFromPath);

  useEffect(() => {
    const onPopState = () => setRoute(routeFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (next: Route) => {
    const path = next === "home" ? "/" : `/${next}`;
    window.history.pushState({}, "", path);
    setRoute(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-shell">
      <Header route={route} onNavigate={navigate} />
      <main id="main">
        {route === "home" && <Home onNavigate={navigate} />}
        {route === "portfolio" && <Portfolio />}
        {route === "about" && <About />}
        {route === "services" && <Services onNavigate={navigate} />}
        {route === "contact" && <Contact />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

function Header({ route, onNavigate }: { route: Route; onNavigate: (route: Route) => void }) {
  return (
    <header className="site-header">
      <button className="wordmark" onClick={() => onNavigate("home")}>Photography Studio</button>
      <nav aria-label="Main navigation">
        {(["portfolio", "about", "services", "contact"] as Route[]).map((item) => (
          <button className={route === item ? "active" : ""} key={item} onClick={() => onNavigate(item)}>
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}

function Home({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Independent photographer · Location to be added</p>
        <h1>Photographs that feel lived in.</h1>
        <p className="lede">A flexible starting point for the final brand story, photography specialty, and signature imagery.</p>
        <div className="actions">
          <button className="primary" onClick={() => onNavigate("portfolio")}>View portfolio</button>
          <button onClick={() => onNavigate("contact")}>Plan a session</button>
        </div>
        <div className="image-placeholder hero-image" role="img" aria-label="Hero photograph placeholder">Hero photograph</div>
      </section>
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2>Photography collections</h2>
        </div>
        <CollectionGrid />
      </section>
    </>
  );
}

function CollectionGrid() {
  return <div className="collection-grid">{collections.map((collection, index) => (
    <article className="collection-card" key={collection.slug}>
      <div className={`image-placeholder image-${index + 1}`} role="img" aria-label={`${collection.title} photograph placeholder`}>Add photograph</div>
      <p className="eyebrow">Collection {String(index + 1).padStart(2, "0")}</p>
      <h3>{collection.title}</h3>
      <p>{collection.description}</p>
    </article>
  ))}</div>;
}

function Portfolio() {
  return <section className="page"><p className="eyebrow">Portfolio</p><h1>Selected stories</h1><p className="lede">This page is ready for real galleries, project titles, and image sequences.</p><CollectionGrid /></section>;
}

function About() {
  return <section className="page split"><div><p className="eyebrow">About</p><h1>The person behind the camera</h1><p className="lede">Add a personal introduction, approach, location, and the kinds of moments you care about photographing.</p></div><div className="image-placeholder portrait" role="img" aria-label="Photographer portrait placeholder">Photographer portrait</div></section>;
}

function Services({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return <section className="page"><p className="eyebrow">Services</p><h1>A clear path from inquiry to gallery</h1><div className="steps"><article><span>01</span><h3>Connect</h3><p>Share your idea, date, location, and what you want the images to feel like.</p></article><article><span>02</span><h3>Plan</h3><p>Shape the session, timeline, styling, and deliverables together.</p></article><article><span>03</span><h3>Create</h3><p>Photograph the story and deliver a thoughtfully edited gallery.</p></article></div><button className="primary" onClick={() => onNavigate("contact")}>Start an inquiry</button></section>;
}

function Contact() {
  return <section className="page contact-page"><div><p className="eyebrow">Contact</p><h1>Tell me what you’re imagining.</h1><p className="lede">The final form can connect to email, Formspree, or another service before launch.</p></div><form onSubmit={(event) => event.preventDefault()}><label>Name<input name="name" autoComplete="name" /></label><label>Email<input name="email" type="email" autoComplete="email" /></label><label>What are you planning?<textarea name="message" rows={6} /></label><button className="primary" type="submit">Send inquiry</button></form></section>;
}

function Footer({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return <footer><p>Photography Studio</p><button onClick={() => onNavigate("contact")}>Bookings & inquiries</button><p>© {new Date().getFullYear()}</p></footer>;
}

export default App;
