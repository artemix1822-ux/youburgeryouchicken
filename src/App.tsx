import { useState, useEffect, useCallback } from 'react'
import './App.css'

const BASE = import.meta.env.BASE_URL

type Cat = 'burgers' | 'chicken' | 'tacos' | 'sides'

const PAGES: { n: number; cat: Cat; title: string }[] = [
  { n: 3, cat: 'burgers', title: 'Les You & Les Big' },
  { n: 4, cat: 'burgers', title: 'Les Incontournables & Les Naans' },
  { n: 5, cat: 'burgers', title: 'Royal, Toast & Giant' },
  { n: 7, cat: 'burgers', title: 'Menus doublés' },
  { n: 2, cat: 'tacos', title: 'Tacos, wraps & grec' },
  { n: 10, cat: 'chicken', title: 'Crousty Thieb' },
  { n: 11, cat: 'chicken', title: 'Les Menus You Chicken' },
  { n: 12, cat: 'chicken', title: 'À la carte' },
  { n: 6, cat: 'sides', title: 'Frites & Menu Premium' },
  { n: 9, cat: 'sides', title: 'Sides & desserts' },
  { n: 8, cat: 'sides', title: 'Menu Kids & Salades' },
]

const FILTERS = [
  { k: 'all', l: 'Tout' },
  { k: 'burgers', l: 'Burgers' },
  { k: 'chicken', l: 'Chicken' },
  { k: 'tacos', l: 'Tacos' },
  { k: 'sides', l: 'Sides & kids' },
]

const ACTIONS = [
  {
    t: 'Le Duel',
    d: 'Un vote hebdo en story : Burger vs Chicken. L’équipe gagnante débloque une promo le week-end.',
  },
  {
    t: 'Commande ton camp',
    d: 'Les clients postent leur plat avec #YouBurgerYouChicken et tentent de gagner un repas offert.',
  },
  {
    t: 'Le menu Duo',
    d: 'Un burger et un chicken à prix réduit, pour les indécis qui veulent les deux équipes.',
  },
]

const SLOGANS = [
  'Team Burger ou Team Chicken ?',
  'You choose. We cook.',
  'Ton craving, ta règle.',
]

const CANAUX = ['TikTok', 'Instagram Reels', 'WhatsApp', 'Affichage campus', 'Micro-influenceurs']

const img = (n: number) => `${BASE}images/menu/page-${String(n).padStart(2, '0')}.webp`

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function App() {
  const [filter, setFilter] = useState<string>('all')
  const [open, setOpen] = useState<number | null>(null)
  const [votes, setVotes] = useState({ burger: 0, chicken: 0 })

  useReveal()

  const list = filter === 'all' ? PAGES : PAGES.filter((p) => p.cat === filter)
  const total = votes.burger + votes.chicken
  const pctB = total === 0 ? 50 : Math.round((votes.burger / total) * 100)
  const pctC = 100 - pctB

  const close = useCallback(() => setOpen(null), [])
  const go = useCallback(
    (d: number) =>
      setOpen((i) => (i === null ? null : (i + d + list.length) % list.length)),
    [list.length]
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, go])

  const vote = (side: 'burger' | 'chicken') =>
    setVotes((v) => ({ ...v, [side]: v[side] + 1 }))

  return (
    <>
      <header className="nav">
        <a href="#top" className="nav-logo">
          <img src={`${BASE}images/logo-round.png`} alt="You Burgers" />
          <span>YouFood</span>
        </a>
        <nav>
          <a href="#duel">Le Duel</a>
          <a href="#menu">Le Menu</a>
          <a href="#campagne">La Campagne</a>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-text">
            <span className="tag">Campagne · Dakar</span>
            <h1>
              Team <em className="red">Burger</em>
              <br />
              ou Team <em className="yellow">Chicken</em> ?
            </h1>
            <p>
              Deux marques, un seul choix. Choisis ton camp et découvre tout le menu You Burgers et
              You Chicken.
            </p>
            <div className="hero-btns">
              <a href="#duel" className="btn btn-red">
                Choisir mon camp
              </a>
              <a href="#menu" className="btn btn-ghost">
                Voir le menu
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <button
              className="float-card left"
              onClick={() => {
                setFilter('burgers')
                setOpen(0)
              }}
            >
              <img src={img(3)} alt="Les You et Les Big" />
            </button>
            <button
              className="float-card right"
              onClick={() => {
                setFilter('chicken')
                setOpen(0)
              }}
            >
              <img src={img(10)} alt="Crousty Thieb" />
            </button>
          </div>
        </section>

        {/* DUEL */}
        <section id="duel" className="section reveal">
          <h2>Le Duel</h2>
          <p className="sub">Vote pour ton équipe (démo interactive).</p>

          <div className="duel">
            <button className="team team-burger" onClick={() => vote('burger')}>
              <img src={`${BASE}images/logo-burgers.png`} alt="You Burgers" />
              <strong>Team Burger</strong>
              <span>
                {votes.burger} vote{votes.burger > 1 ? 's' : ''}
              </span>
            </button>
            <div className="vs">VS</div>
            <button className="team team-chicken" onClick={() => vote('chicken')}>
              <img src={`${BASE}images/logo-chicken.png`} alt="You Chicken" />
              <strong>Team Chicken</strong>
              <span>
                {votes.chicken} vote{votes.chicken > 1 ? 's' : ''}
              </span>
            </button>
          </div>

          <div className="bar">
            <div className="bar-b" style={{ width: `${pctB}%` }}>
              {pctB}%
            </div>
            <div className="bar-c" style={{ width: `${pctC}%` }}>
              {pctC}%
            </div>
          </div>
        </section>

        {/* MENU */}
        <section id="menu" className="section">
          <h2 className="reveal">Le Menu</h2>
          <p className="sub reveal">Clique sur une page pour la voir en grand.</p>

          <div className="filters reveal">
            {FILTERS.map((f) => (
              <button
                key={f.k}
                className={filter === f.k ? 'chip active' : 'chip'}
                onClick={() => setFilter(f.k)}
              >
                {f.l}
              </button>
            ))}
          </div>

          <div className="grid">
            {list.map((p, i) => (
              <button key={p.n} className="card" onClick={() => setOpen(i)}>
                <img src={img(p.n)} alt={p.title} loading="lazy" />
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </section>

        {/* CAMPAGNE */}
        <section id="campagne" className="section">
          <h2 className="reveal">La Campagne</h2>
          <p className="sub reveal">
            Concept : « Toi, ton choix ». Chacun a son camp, la marque en fait un jeu.
          </p>

          <div className="actions">
            {ACTIONS.map((a, i) => (
              <div key={a.t} className="action reveal">
                <b>0{i + 1}</b>
                <h3>{a.t}</h3>
                <p>{a.d}</p>
              </div>
            ))}
          </div>

          <div className="chips-row reveal">
            <h4>Slogans</h4>
            {SLOGANS.map((s) => (
              <span key={s} className="pill">
                {s}
              </span>
            ))}
          </div>

          <div className="chips-row reveal">
            <h4>Canaux</h4>
            {CANAUX.map((c) => (
              <span key={c} className="pill dark">
                {c}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <img src={`${BASE}images/logo-youfood.png`} alt="YouFood" />
        <p>
          Projet de démonstration réalisé pour un entretien. Visuels et marques © You Burgers · You
          Chicken by YouFood.
        </p>
      </footer>

      {open !== null && list[open] && (
        <div className="lightbox" onClick={close}>
          <button className="lb-close" onClick={close} aria-label="Fermer">
            ×
          </button>
          <button
            className="lb-nav prev"
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
            aria-label="Précédent"
          >
            ‹
          </button>
          <img
            src={img(list[open].n)}
            alt={list[open].title}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lb-nav next"
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
            aria-label="Suivant"
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}