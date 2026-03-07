import React, { useState, useEffect, useRef, useCallback } from 'react';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --bg: #faf9f7;
    --bg-2: #f2f0ec;
    --bg-card: #ffffff;
    --ink: #1a1814;
    --ink-2: #5a5650;
    --ink-3: #9a9590;
    --rule: #e4e1db;
    --green: #2d6a4f;
    --green-mid: #52b788;
    --green-light: #d8f3dc;
    --green-glow: rgba(82,183,136,0.15);
    --mono: 'DM Mono', monospace;
    --serif: 'Instrument Serif', Georgia, serif;
    --sans: 'DM Sans', system-ui, sans-serif;
    --ease: cubic-bezier(0.16,1,0.3,1);
  }
  [data-theme="dark"] {
    --bg: #0d0d0b;
    --bg-2: #141412;
    --bg-card: #181715;
    --ink: #f0ede8;
    --ink-2: #a09b94;
    --ink-3: #5a5650;
    --rule: #262420;
    --green: #52b788;
    --green-mid: #74c69d;
    --green-light: rgba(82,183,136,0.1);
    --green-glow: rgba(82,183,136,0.08);
  }

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{
    font-family:var(--sans);background:var(--bg);color:var(--ink);
    line-height:1.6;-webkit-font-smoothing:antialiased;
    transition:background 0.5s var(--ease),color 0.5s var(--ease);
    overflow-x:hidden;
  }
  ::selection{background:var(--green-light);color:var(--green);}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:var(--bg);}
  ::-webkit-scrollbar-thumb{background:var(--rule);border-radius:3px;}
  ::-webkit-scrollbar-thumb:hover{background:var(--green-mid);}
  a{text-decoration:none;color:inherit;}
  ul{list-style:none;}
  .container{max-width:980px;margin:0 auto;padding:0 2rem;}

  .reveal{opacity:0;transform:translateY(28px);transition:opacity 0.85s var(--ease),transform 0.85s var(--ease);}
  .reveal.active{opacity:1;transform:translateY(0);}
  .reveal-delay-1{transition-delay:0.1s;}
  .reveal-delay-2{transition-delay:0.2s;}
  .reveal-delay-3{transition-delay:0.3s;}

  .eyebrow{
    font-family:var(--mono);font-size:0.7rem;letter-spacing:0.18em;
    text-transform:uppercase;color:var(--green-mid);
    display:flex;align-items:center;gap:0.75rem;margin-bottom:2.5rem;
  }
  .eyebrow::before{content:'';display:block;width:28px;height:1px;background:var(--green-mid);flex-shrink:0;}

  .nav-wrapper{
    position:fixed;top:1.25rem;left:50%;transform:translateX(-50%);
    z-index:1000;
    width:calc(100% - 3rem);max-width:760px;
  }

  .navbar{
    display:flex;align-items:center;justify-content:space-between;
    gap:0.5rem;
    padding:0.5rem 0.5rem 0.5rem 1.1rem;
    border-radius:100px;
    background:rgba(250,249,247,0.72);
    border:1px solid var(--rule);
    backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
    box-shadow:0 2px 24px rgba(0,0,0,0.06),0 1px 0 rgba(255,255,255,0.85) inset;
    transition:box-shadow 0.4s var(--ease),background 0.4s var(--ease);
  }
  [data-theme="dark"] .navbar{
    background:rgba(13,13,11,0.82);
    box-shadow:0 2px 24px rgba(0,0,0,0.45),0 1px 0 rgba(255,255,255,0.04) inset;
  }
  .navbar.scrolled{box-shadow:0 6px 40px rgba(0,0,0,0.1),0 1px 0 rgba(255,255,255,0.85) inset;}
  [data-theme="dark"] .navbar.scrolled{box-shadow:0 6px 40px rgba(0,0,0,0.55),0 1px 0 rgba(255,255,255,0.04) inset;}

  .logo{display:flex;align-items:center;gap:0.6rem;font-family:var(--serif);font-size:1.15rem;font-style:italic;letter-spacing:-0.01em;color:var(--ink);white-space:nowrap;flex-shrink:0;transition:opacity 0.2s;}
  .logo img{width:24px;height:24px;border-radius:4px;}
  .logo:hover{opacity:0.6;}
  .logo em{color:var(--green-mid);font-style:normal;}

  .nav-links{display:flex;align-items:center;gap:0.05rem;position:relative;flex:1;justify-content:center;}
  .nav-link{font-size:0.8rem;font-weight:500;color:var(--ink-2);padding:0.38rem 0.75rem;border-radius:100px;position:relative;z-index:1;white-space:nowrap;transition:color 0.2s var(--ease);}
  .nav-link:hover{color:var(--ink);}
  .nav-link.active-section{color:var(--ink);}

  .nav-highlight{position:absolute;height:100%;top:0;background:var(--bg-2);border:1px solid var(--rule);border-radius:100px;pointer-events:none;opacity:0;transition:left 0.28s var(--ease),width 0.28s var(--ease),opacity 0.15s;}
  [data-theme="dark"] .nav-highlight{background:rgba(255,255,255,0.07);border-color:var(--rule);}
  .nav-links:hover .nav-highlight{opacity:1;}

  .theme-btn{background:var(--bg-2);border:1px solid var(--rule);width:32px;height:32px;border-radius:50%;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.82rem;color:var(--ink);transition:background 0.2s,border-color 0.2s,transform 0.3s var(--ease);}
  .theme-btn:hover{background:var(--green-light);border-color:var(--green-mid);transform:rotate(22deg) scale(1.1);}
  [data-theme="dark"] .theme-btn{background:rgba(255,255,255,0.06);}

  .cv-btn{
    display:inline-flex;align-items:center;gap:0.35rem;
    font-family:var(--mono);font-size:0.68rem;font-weight:500;
    letter-spacing:0.06em;text-transform:uppercase;
    color:var(--green);background:var(--green-light);
    border:1px solid rgba(82,183,136,0.35);
    padding:0.35rem 0.75rem;border-radius:100px;flex-shrink:0;
    transition:background 0.2s,border-color 0.2s,transform 0.25s var(--ease),box-shadow 0.25s,color 0.2s;
    white-space:nowrap;
  }
  .cv-btn:hover{background:var(--green);color:#fff;border-color:var(--green);transform:translateY(-1px);box-shadow:0 6px 18px rgba(45,106,79,0.22);}
  .cv-btn svg{width:11px;height:11px;flex-shrink:0;}
  [data-theme="dark"] .cv-btn{color:var(--green-mid);background:rgba(82,183,136,0.1);border-color:rgba(82,183,136,0.2);}
  [data-theme="dark"] .cv-btn:hover{background:var(--green-mid);color:#0d0d0b;border-color:var(--green-mid);}

  @media(max-width:640px){.cv-btn span{display:none;}.cv-btn{padding:0.35rem 0.55rem;}}

  /* ── HERO — compact ── */
  .hero{padding:5.5rem 2rem 3.5rem;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;top:-20%;right:-10%;width:60%;height:110%;background:radial-gradient(ellipse at top right,rgba(82,183,136,0.06) 0%,transparent 65%);pointer-events:none;}

  .hero-inner{max-width:980px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 340px;gap:3rem;align-items:center;position:relative;z-index:1;}

  .hero-badge{display:inline-flex;align-items:center;gap:0.5rem;background:var(--bg-card);border:1px solid var(--rule);border-radius:100px;padding:0.28rem 0.75rem 0.28rem 0.4rem;margin-bottom:1.25rem;width:fit-content;font-family:var(--mono);font-size:0.63rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3);transition:border-color 0.25s;}
  .hero-badge:hover{border-color:var(--green-mid);}
  .dot{width:6px;height:6px;background:var(--green-mid);border-radius:50%;flex-shrink:0;animation:pulse 2.5s ease-in-out infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.2;transform:scale(0.5);}}

  .hero-h1{font-family:var(--serif);font-size:clamp(2.8rem,5.5vw,4.6rem);font-weight:400;line-height:1.08;letter-spacing:-0.035em;margin-bottom:1rem;color:var(--ink);}
  .hero-h1 .word-dim{color:var(--ink-3);}
  .hero-h1 .word-accent{color:var(--green-mid);font-style:italic;}

  .hero-role{display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;}
  .hero-role-bar{width:20px;height:1.5px;background:var(--green-mid);border-radius:2px;flex-shrink:0;}
  .hero-role-text{font-family:var(--mono);font-size:0.78rem;color:var(--green-mid);letter-spacing:0.06em;min-width:190px;}
  .cursor{display:inline-block;width:1.5px;height:0.8em;background:var(--green-mid);margin-left:1px;vertical-align:middle;border-radius:1px;animation:blink 1s step-end infinite;}
  @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}

  .hero-sub{font-size:0.95rem;color:var(--ink-2);line-height:1.7;margin-bottom:1.75rem;font-weight:300;}
  .hero-cta{display:flex;align-items:center;gap:0.85rem;flex-wrap:wrap;}

  .btn-fill{display:inline-flex;align-items:center;gap:0.4rem;background:var(--ink);color:var(--bg);font-size:0.875rem;font-weight:600;padding:0.7rem 1.35rem;border-radius:100px;transition:background 0.25s,transform 0.3s var(--ease),color 0.25s,box-shadow 0.3s;}
  .btn-fill:hover{background:var(--green);color:#fff;transform:translateY(-2px);box-shadow:0 10px 22px rgba(45,106,79,0.22);}
  .btn-ghost{display:inline-flex;align-items:center;gap:0.4rem;font-size:0.875rem;font-weight:500;color:var(--ink-2);padding:0.7rem 1.15rem;border-radius:100px;border:1px solid var(--rule);transition:color 0.2s,border-color 0.2s,background 0.2s,transform 0.2s var(--ease);}
  .btn-ghost:hover{color:var(--ink);border-color:var(--ink-3);background:var(--bg-2);transform:translateY(-2px);}

  .hero-card{background:var(--bg-card);border:1px solid var(--rule);border-radius:16px;overflow:hidden;}
  .hero-card-top{padding:1.25rem 1.5rem;border-bottom:1px solid var(--rule);}
  .hero-card-name{font-family:var(--serif);font-size:1.2rem;font-weight:400;letter-spacing:-0.01em;margin-bottom:0.15rem;}
  .hero-card-title{font-family:var(--mono);font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-3);}
  .hero-card-rows{display:flex;flex-direction:column;}
  .hero-card-row{display:flex;align-items:center;justify-content:space-between;padding:0.7rem 1.5rem;border-bottom:1px solid var(--rule);transition:background 0.18s;cursor:default;}
  .hero-card-row:last-child{border-bottom:none;}
  .hero-card-row:hover{background:var(--bg-2);}
  .hcr-label{font-family:var(--mono);font-size:0.63rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-3);}
  .hcr-val{font-size:0.85rem;font-weight:500;color:var(--ink);}
  .hcr-dot{width:7px;height:7px;background:var(--green-mid);border-radius:50%;animation:pulse 2.5s ease-in-out infinite;}

  .hero-scroll{max-width:980px;margin:2rem auto 0;display:flex;align-items:center;gap:0.6rem;color:var(--ink-3);font-size:0.67rem;font-family:var(--mono);letter-spacing:0.14em;text-transform:uppercase;}
  .scroll-line{width:28px;height:1px;background:var(--rule);position:relative;overflow:hidden;}
  .scroll-line::after{content:'';position:absolute;left:-100%;top:0;width:100%;height:100%;background:var(--green-mid);animation:slide-r 2s ease-in-out infinite;}
  @keyframes slide-r{0%{left:-100%;}50%{left:0%;}100%{left:100%;}}

  .section{padding:7rem 2rem;border-top:1px solid var(--rule);}
  .section-header{margin-bottom:4rem;}
  .section-title{font-family:var(--serif);font-size:clamp(2rem,4vw,2.75rem);font-weight:400;line-height:1.15;letter-spacing:-0.02em;}
  .section-title em{font-style:italic;color:var(--ink-2);}

  .stats-bar{border-top:1px solid var(--rule);background:var(--bg-2);padding:0 2rem;}
  .stats-inner{max-width:980px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);}
  .stat-item{padding:2rem 1.5rem;border-right:1px solid var(--rule);transition:background 0.2s;cursor:default;}
  .stat-item:last-child{border-right:none;}
  .stat-item:hover{background:var(--green-glow);}
  .stat-num{font-family:var(--serif);font-size:2.5rem;font-weight:400;line-height:1;letter-spacing:-0.03em;color:var(--ink);margin-bottom:0.35rem;}
  .stat-num em{font-style:normal;color:var(--green-mid);font-size:1.5rem;}
  .stat-label{font-family:var(--mono);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-3);}
  .stat-platform{font-size:0.75rem;color:var(--green-mid);font-weight:500;margin-top:0.25rem;display:block;}

  .timeline-track{position:relative;padding-left:2rem;}
  .timeline-track::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:2px;background:linear-gradient(to bottom,var(--green-mid),var(--rule));border-radius:2px;}
  .tl-item{position:relative;padding-bottom:2.5rem;cursor:default;}
  .tl-item:last-child{padding-bottom:0;}
  .tl-dot{position:absolute;left:-2.45rem;top:0.3rem;width:12px;height:12px;border-radius:50%;background:var(--bg);border:2px solid var(--green-mid);transition:background 0.25s,transform 0.25s var(--ease),box-shadow 0.25s;z-index:1;}
  .tl-item:hover .tl-dot{background:var(--green-mid);transform:scale(1.3);box-shadow:0 0 0 4px var(--green-glow);}
  .tl-date{font-family:var(--mono);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--green-mid);margin-bottom:0.3rem;}
  .tl-title{font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:0.2rem;transition:color 0.2s;}
  .tl-item:hover .tl-title{color:var(--green-mid);}
  .tl-sub{font-size:0.875rem;color:var(--ink-2);font-weight:300;}
  .tl-badge{display:inline-block;margin-top:0.5rem;font-family:var(--mono);font-size:0.62rem;text-transform:uppercase;letter-spacing:0.1em;background:var(--green-light);color:var(--green);padding:0.18rem 0.55rem;border-radius:100px;}

  .exp-list{display:flex;flex-direction:column;}
  .exp-item{display:grid;grid-template-columns:220px 1fr;gap:2rem;padding:2.5rem 0;border-bottom:1px solid var(--rule);transition:background 0.2s;}
  .exp-item:first-child{border-top:1px solid var(--rule);}
  .exp-period{font-family:var(--mono);font-size:0.68rem;color:var(--ink-3);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:0.4rem;}
  .exp-company{font-size:0.9rem;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;}
  .exp-badge{display:inline-block;font-family:var(--mono);font-size:0.62rem;text-transform:uppercase;letter-spacing:0.1em;background:var(--green-light);color:var(--green);padding:0.18rem 0.55rem;border-radius:100px;}
  .exp-role{font-family:var(--serif);font-size:1.4rem;font-weight:400;margin-bottom:1rem;letter-spacing:-0.01em;}
  .exp-bullets{display:flex;flex-direction:column;gap:0.6rem;}
  .exp-bullets li{font-size:0.95rem;color:var(--ink-2);line-height:1.65;display:flex;gap:0.75rem;align-items:flex-start;transition:color 0.2s,transform 0.25s var(--ease);}
  .exp-bullets li:hover{color:var(--ink);transform:translateX(4px);}
  .exp-bullets li::before{content:'—';color:var(--green-mid);flex-shrink:0;margin-top:0.05rem;font-weight:300;}

  .projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;}
  .project-card{background:var(--bg-card);border:1px solid var(--rule);border-radius:16px;padding:2rem;display:flex;flex-direction:column;position:relative;overflow:hidden;transition:border-color 0.3s,transform 0.4s var(--ease),box-shadow 0.4s;cursor:default;}
  .project-card .spotlight{position:absolute;inset:0;pointer-events:none;border-radius:16px;background:radial-gradient(400px circle at var(--mx,50%) var(--my,50%),var(--green-glow),transparent 60%);opacity:0;transition:opacity 0.3s;}
  .project-card:hover .spotlight{opacity:1;}
  .project-card:hover{border-color:var(--green-mid);transform:translateY(-6px);box-shadow:0 24px 64px rgba(0,0,0,0.1);}
  .project-num{font-family:var(--mono);font-size:0.65rem;color:var(--ink-3);letter-spacing:0.12em;margin-bottom:1.25rem;}
  .project-title{font-family:var(--serif);font-size:1.5rem;font-weight:400;letter-spacing:-0.01em;margin-bottom:0.75rem;}
  .project-desc{font-size:0.9rem;color:var(--ink-2);line-height:1.7;margin-bottom:1.5rem;flex-grow:1;font-weight:300;}
  .tech-tags{display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.75rem;}
  .tag{font-family:var(--mono);font-size:0.68rem;letter-spacing:0.06em;background:var(--bg-2);color:var(--ink-2);padding:0.25rem 0.65rem;border-radius:100px;border:1px solid var(--rule);transition:background 0.25s,color 0.25s,border-color 0.25s,transform 0.2s var(--ease);}
  .project-card:hover .tag{background:var(--green-light);color:var(--green);border-color:transparent;}
  .project-links{display:flex;gap:1rem;border-top:1px solid var(--rule);padding-top:1.25rem;}
  .project-link{font-family:var(--mono);font-size:0.72rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-3);display:flex;align-items:center;gap:0.35rem;position:relative;overflow:hidden;padding-bottom:1px;transition:color 0.2s;}
  .project-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--green-mid);transition:width 0.3s var(--ease);}
  .project-link:hover{color:var(--green-mid);}
  .project-link:hover::after{width:100%;}
  .project-link svg{width:11px;height:11px;}

  .skills-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;}
  .skill-group{background:var(--bg-card);border:1px solid var(--rule);border-radius:12px;padding:1.75rem;transition:border-color 0.25s,transform 0.3s var(--ease);}
  .skill-group:hover{border-color:rgba(82,183,136,0.4);transform:translateY(-2px);}
  .skill-group-label{font-family:var(--mono);font-size:0.65rem;text-transform:uppercase;letter-spacing:0.16em;color:var(--ink-3);margin-bottom:1.25rem;font-weight:400;}
  .skill-pills{display:flex;flex-wrap:wrap;gap:0.5rem;}
  .skill-pill{font-size:0.875rem;font-weight:500;padding:0.45rem 0.9rem;border:1px solid var(--rule);border-radius:100px;color:var(--ink-2);background:var(--bg-2);transition:color 0.2s,border-color 0.2s,background 0.2s,transform 0.2s var(--ease);cursor:default;}
  .skill-pill:hover{color:var(--green);border-color:var(--green-mid);background:var(--green-light);transform:translateY(-3px);}

  .cp-group{grid-column:span 2;background:var(--bg-card);border:1px solid var(--rule);border-radius:12px;padding:1.75rem;position:relative;overflow:hidden;transition:border-color 0.25s;}
  .cp-group:hover{border-color:rgba(82,183,136,0.4);}
  .cp-group::after{content:'</>';position:absolute;bottom:-14px;right:4px;font-family:var(--mono);font-size:5.5rem;color:var(--rule);line-height:1;pointer-events:none;transition:color 0.4s,transform 0.4s var(--ease);}
  .cp-group:hover::after{color:var(--green-light);transform:translateX(-6px);}
  .cp-group-title{font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:0.5rem;}
  .cp-group-desc{font-size:0.875rem;color:var(--ink-2);line-height:1.7;font-weight:300;position:relative;z-index:1;margin-bottom:1.5rem;}
  .cp-stats-row{display:flex;gap:1rem;position:relative;z-index:1;}
  .cp-stat{background:var(--bg-2);border-radius:8px;padding:1rem 1.5rem;display:flex;align-items:baseline;gap:0.5rem;transition:background 0.2s,transform 0.2s var(--ease);}
  .cp-stat:hover{background:var(--green-light);transform:translateY(-2px);}
  .cp-stat-num{font-family:var(--serif);font-size:2rem;color:var(--green-mid);letter-spacing:-0.02em;line-height:1;}
  .cp-stat-label{font-family:var(--mono);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-3);}

  .edu-card{background:var(--bg-card);border:1px solid var(--rule);border-radius:12px;padding:2.5rem;display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:start;transition:border-color 0.3s,transform 0.35s var(--ease),box-shadow 0.35s;}
  .edu-card:hover{border-color:var(--green-mid);transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.08);}
  .edu-degree{font-family:var(--serif);font-size:1.6rem;font-weight:400;letter-spacing:-0.01em;margin-bottom:0.5rem;}
  .edu-uni{font-size:1rem;color:var(--ink-2);font-weight:500;margin-bottom:0.25rem;}
  .edu-loc{font-size:0.875rem;color:var(--ink-3);font-weight:300;}
  .edu-right{text-align:right;}
  .edu-year{font-family:var(--serif);font-size:2rem;color:var(--green-mid);font-weight:400;letter-spacing:-0.02em;line-height:1;margin-bottom:0.4rem;}
  .edu-status{font-family:var(--mono);font-size:0.65rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-3);}

  .certs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;}
  .cert-card{background:var(--bg-card);border:1px solid var(--rule);border-radius:12px;padding:2rem;display:flex;flex-direction:column;gap:1.25rem;transition:border-color 0.25s,transform 0.3s var(--ease),box-shadow 0.3s;cursor:default;min-height:180px;}
  .cert-card:hover{border-color:var(--green-mid);transform:translateY(-5px);box-shadow:0 20px 40px rgba(0,0,0,0.12);}
  .cert-icon svg, .ach-icon svg { width: 100%; height: 100%; stroke: var(--green-mid); transition: transform 0.3s; }
  .cert-card:hover .cert-icon svg, .ach-card:hover .ach-icon svg { transform: scale(1.1); }
  .cert-title{font-size:1.05rem;font-weight:600;line-height:1.4;color:var(--ink-1);}
  .cert-issuer{font-family:var(--mono);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--green-mid);margin-top:auto;}

  .achievements-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;}
  .ach-card{background:var(--bg-card);border:1px solid var(--rule);border-radius:12px;padding:2rem;display:flex;gap:1.5rem;align-items:flex-start;transition:border-color 0.25s,transform 0.3s var(--ease),box-shadow 0.3s;cursor:default;}
  .ach-card:hover{border-color:var(--green-mid);transform:translateY(-4px);box-shadow:0 16px 32px rgba(0,0,0,0.1);}
  .ach-icon{flex-shrink:0;display:flex;align-items:center;width:52px;height:52px;}
  .ach-title{font-size:1rem;font-weight:600;line-height:1.3;margin-bottom:0.4rem;color:var(--ink-1);}
  .ach-desc{font-size:0.85rem;color:var(--ink-2);font-weight:300;line-height:1.6;}

  .footer{border-top:1px solid var(--rule);padding:8rem 2rem 5rem;text-align:center;position:relative;overflow:hidden;}
  .footer-bg{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:700px;height:400px;background:radial-gradient(ellipse at bottom,var(--green-glow),transparent 70%);pointer-events:none;filter:blur(40px);}
  .footer-inner{position:relative;z-index:1;}
  .footer-label{font-family:var(--mono);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.18em;color:var(--ink-3);margin-bottom:1.5rem;display:block;}
  .footer h2{font-family:var(--serif);font-size:clamp(2rem,5vw,3.5rem);font-weight:400;line-height:1.15;letter-spacing:-0.02em;max-width:600px;margin:0 auto 2.5rem;}
  .footer h2 em{font-style:italic;color:var(--green-mid);}
  .email-container{display:flex;align-items:center;justify-content:center;gap:0.75rem;margin-bottom:2.5rem;}
  .email-btn{display:inline-flex;align-items:center;gap:0.5rem;font-size:clamp(1rem,2vw,1.2rem);font-weight:600;color:var(--ink);background:var(--bg-card);border:1px solid var(--rule);padding:1rem 2rem;border-radius:100px;transition:background 0.25s,border-color 0.25s,transform 0.3s var(--ease),color 0.25s,box-shadow 0.25s;}
  .email-btn:hover{background:var(--green);border-color:var(--green);color:#fff;transform:translateY(-4px);box-shadow:0 16px 40px rgba(45,106,79,0.3);}
  .copy-btn{font-family:var(--mono);font-size:0.65rem;text-transform:uppercase;letter-spacing:0.12em;background:var(--bg-2);border:1px solid var(--rule);padding:0.6rem 1.2rem;border-radius:100px;cursor:pointer;transition:all 0.25s;color:var(--ink-3);font-weight:600;}
  .copy-btn:hover{background:var(--green-light);border-color:var(--green-mid);color:var(--green-mid);transform:translateY(-2px);}
  .socials{margin-top:3.5rem;display:flex;justify-content:center;gap:1rem;}
  .social-link{display:flex;align-items:center;gap:0.55rem;font-size:0.85rem;font-weight:500;color:var(--ink-3);padding:0.5rem 1rem;border-radius:100px;border:1px solid var(--rule);transition:all 0.2s;}
  .social-link svg{width:18px;height:18px;transition:transform 0.2s;}
  .social-link:hover{color:var(--ink);background:var(--bg-card);border-color:var(--green-mid);transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.05);}
  .social-link:hover svg{transform:scale(1.1);}
  .footer-copy{margin-top:4rem;font-family:var(--mono);font-size:0.7rem;color:var(--ink-3);letter-spacing:0.08em;padding-top:2rem;border-top:1px solid var(--rule);}

  main{padding-top:0;}

  .hamburger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:4.5px;width:32px;height:32px;background:var(--bg-2);border:1px solid var(--rule);border-radius:8px;cursor:pointer;flex-shrink:0;transition:background 0.2s,border-color 0.2s;}
  .hamburger:hover{background:var(--green-light);border-color:var(--green-mid);}
  .hamburger span{display:block;width:14px;height:1.5px;background:var(--ink);border-radius:2px;transition:transform 0.3s var(--ease),opacity 0.2s,width 0.3s var(--ease);}
  .hamburger.open span:nth-child(1){transform:translateY(6px) rotate(45deg);}
  .hamburger.open span:nth-child(2){opacity:0;width:0;}
  .hamburger.open span:nth-child(3){transform:translateY(-6px) rotate(-45deg);}

  .mobile-menu{position:fixed;inset:0;z-index:999;background:var(--bg);display:flex;flex-direction:column;padding:5.5rem 2rem 3rem;transform:translateX(100%);transition:transform 0.4s var(--ease);pointer-events:none;}
  .mobile-menu.open{transform:translateX(0);pointer-events:auto;}
  .mobile-nav-links{display:flex;flex-direction:column;gap:0;}
  .mobile-nav-link{font-family:var(--serif);font-size:2.2rem;font-weight:400;letter-spacing:-0.02em;color:var(--ink-2);padding:0.6rem 0;border-bottom:1px solid var(--rule);transition:color 0.2s,padding-left 0.25s var(--ease);}
  .mobile-nav-link:hover,.mobile-nav-link.active-section{color:var(--green-mid);padding-left:0.5rem;}
  .mobile-menu-footer{margin-top:auto;font-family:var(--mono);font-size:0.7rem;color:var(--ink-3);letter-spacing:0.1em;text-transform:uppercase;}

  @media(max-width:860px){
    .nav-wrapper{width:calc(100% - 2rem);}
    .nav-link{padding:0.35rem 0.6rem;font-size:0.75rem;}
    .stats-inner{grid-template-columns:repeat(2,1fr);}
    .stat-item:nth-child(2){border-right:none;}
  }
  @media(max-width:640px){
    .nav-wrapper{top:0.85rem;width:calc(100% - 1.5rem);}
    .navbar{padding:0.4rem 0.4rem 0.4rem 1rem;}
    .nav-links{display:none;}
    .hamburger{display:flex;}
    .hero{padding:5rem 1.25rem 3rem;}
    .hero-inner{grid-template-columns:1fr;gap:2rem;}
    .hero-card{order:2;}
    .hero-left{order:1;}
    .hero-h1{font-size:clamp(2.4rem,10vw,3.2rem);margin-bottom:1rem;}
    .section{padding:4rem 1.25rem;}
    .section-title{font-size:clamp(1.75rem,7vw,2.25rem);}
    .container{padding:0 1.25rem;}
    .stats-bar{padding:0 1.25rem;}
    .stats-inner{grid-template-columns:repeat(2,1fr);}
    .stat-item{padding:1.5rem 1rem;}
    .stat-item:nth-child(2){border-right:none;}
    .stat-num{font-size:2rem;}
    .exp-item{grid-template-columns:1fr;gap:0.5rem;padding:2rem 0;}
    .exp-role{font-size:1.2rem;}
    .projects-grid{grid-template-columns:1fr;}
    .skills-grid{grid-template-columns:1fr;}
    .cp-group{grid-column:span 1;}
    .cp-stats-row{flex-direction:column;}
    .edu-card{grid-template-columns:1fr;padding:1.75rem;}
    .edu-right{text-align:left;margin-top:1rem;}
    .edu-degree{font-size:1.3rem;}
    .certs-grid{grid-template-columns:repeat(2,1fr);}
    .footer{padding:5rem 1.25rem 3rem;}
    .email-btn{font-size:0.95rem;padding:0.85rem 1.5rem;}
    .achievements-grid{grid-template-columns:1fr;}
  }
  @media(max-width:400px){
    .hero-h1{font-size:2.1rem;}
    .hero-cta{flex-direction:column;align-items:stretch;}
    .btn-fill,.btn-ghost{justify-content:center;}
    .certs-grid{grid-template-columns:1fr;}
  }
`;

const useScrollReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('active'); obs.unobserve(el); }
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const Navbar = ({ isDark, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const linksRef = useRef(null);
  const highlightRef = useRef(null);
  const sections = ['timeline', 'experience', 'projects', 'skills', 'education', 'contact'];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { rootMargin: '-40% 0px -40% 0px' });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const handleLinkMouseEnter = useCallback((e) => {
    const hl = highlightRef.current;
    const container = linksRef.current;
    if (!hl || !container) return;
    const linkRect = e.currentTarget.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    hl.style.left = `${linkRect.left - containerRect.left}px`;
    hl.style.width = `${linkRect.width}px`;
  }, []);

  return (
    <>
      <div className="nav-wrapper">
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
          <a href="#" className="logo">
            <img src="/favicon.png" alt="Logo" />
            Lakshay<em>.</em>
          </a>
          <div className="nav-links" ref={linksRef}>
            <div className="nav-highlight" ref={highlightRef} />
            {sections.map(id => (
              <a key={id} href={`#${id}`} className={`nav-link${activeSection === id ? ' active-section' : ''}`} onMouseEnter={handleLinkMouseEnter}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href="https://drive.google.com/uc?export=download&id=1y4UfoxQ7b9xsN5gvNZmUr3RvbJl9t9vD"
              className="cv-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Resume"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15V3M7 10l5 5 5-5" /><path d="M20 21H4" />
              </svg>
              <span>Resume</span>
            </a>
            <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle theme">{isDark ? '☀️' : '🌙'}</button>
            <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
              <span /><span /><span />
            </button>
          </div>
        </nav>
      </div>
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="mobile-nav-links">
          {sections.map(id => (
            <a key={id} href={`#${id}`} className={`mobile-nav-link${activeSection === id ? ' active-section' : ''}`} onClick={() => setMenuOpen(false)}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
        <div className="mobile-menu-footer">
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0 }}>
            {isDark ? 'Switch to Light ☀️' : 'Switch to Dark 🌙'}
          </button>
        </div>
      </div>
    </>
  );
};

const SpotlightCard = ({ children }) => {
  const cardRef = useRef(null);
  const onMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);
  return (
    <article ref={cardRef} className="project-card" onMouseMove={onMouseMove}>
      <div className="spotlight" />{children}
    </article>
  );
};

const useTypewriter = (words, { typingSpeed = 80, deletingSpeed = 45, pauseMs = 1800 } = {}) => {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState('typing');
  useEffect(() => {
    const word = words[wordIdx];
    let timer;
    if (phase === 'typing') {
      if (display.length < word.length) timer = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), typingSpeed);
      else timer = setTimeout(() => setPhase('pausing'), pauseMs);
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('deleting'), 200);
    } else {
      if (display.length > 0) timer = setTimeout(() => setDisplay(d => d.slice(0, -1)), deletingSpeed);
      else { setWordIdx(i => (i + 1) % words.length); setPhase('typing'); }
    }
    return () => clearTimeout(timer);
  }, [display, phase, wordIdx, words, typingSpeed, deletingSpeed, pauseMs]);
  return display;
};

const ROLES = ['Engineer', 'Software Engineer', 'Full Stack Engineer'];

const HeroSection = () => {
  const role = useTypewriter(ROLES);
  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="hero-left">
          <div className="hero-badge reveal active">
            <span className="dot" />
            Open to opportunities
          </div>
          <h1 className="hero-h1 reveal active" style={{ transitionDelay: '0.08s' }}>
            Hi, I'm <span className="word-accent">Lakshay.</span>
          </h1>
          <div className="hero-role reveal active" style={{ transitionDelay: '0.16s' }}>
            <div className="hero-role-bar" />
            <span className="hero-role-text">{role}<span className="cursor" /></span>
          </div>
          <p className="hero-sub reveal active" style={{ transitionDelay: '0.22s' }}>
            Building production-grade Angular &amp; Node.js apps.
          </p>
          <div className="hero-cta reveal active" style={{ transitionDelay: '0.28s' }}>
            <a href="#contact" className="btn-fill">
              Get in touch
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#projects" className="btn-ghost">View my work</a>
          </div>
        </div>

        <div className="hero-card reveal active" style={{ transitionDelay: '0.18s' }}>
          <div className="hero-card-top">
            <div className="hero-card-name">Lakshay Bhatia</div>
            <div className="hero-card-title">Associate Full Stack Developer</div>
          </div>
          <div className="hero-card-rows">
            {[
              { label: 'Location', val: 'Mohali, Punjab, IN' },
              { label: 'Company', val: 'Bridging Technology' },
              { label: 'Stack', val: 'Angular · Node · SQL' },
              { label: 'LeetCode', val: '500+ problems' },
              { label: 'Status', val: null, dot: true },
            ].map((r, i) => (
              <div className="hero-card-row" key={i}>
                <span className="hcr-label">{r.label}</span>
                {r.dot
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--green-mid)' }}>
                    <span className="hcr-dot" /> Open to work
                  </span>
                  : <span className="hcr-val">{r.val}</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="scroll-line" />
        Scroll
      </div>
    </header>
  );
};

const StatsBar = () => (
  <div className="stats-bar">
    <div className="stats-inner">
      {[
        { num: '500', suffix: '+', label: 'Problems Solved', platform: 'Coding Platforms' },
        { num: '15', suffix: 'th', label: 'Young Turks 2024', platform: 'Naukri Campus · 510K participants' },
        { num: '5', suffix: '+', label: 'Features Shipped', platform: 'Production · Fintech' },
        { num: '2', suffix: '🏆', label: 'Hackathon Wins', platform: 'KRMU & CTF Aravali' },
      ].map((s, i) => (
        <div className="stat-item" key={i}>
          <div className="stat-num">{s.num}<em>{s.suffix}</em></div>
          <div className="stat-label">{s.label}</div>
          <span className="stat-platform">{s.platform}</span>
        </div>
      ))}
    </div>
  </div>
);

const TimelineSection = () => {
  const ref = useScrollReveal();
  return (
    <section id="timeline" className="section reveal" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Journey</div>
          <h2 className="section-title">How I got <em>here.</em></h2>
        </div>
        <div className="timeline-track">
          {[
            { date: 'Nov 2021', title: 'B.Tech — Electronics & Computer Engineering', sub: 'J.C. Bose University of Science & Technology, YMCA · Faridabad', badge: 'University' },
            { date: 'May 2025', title: 'Full Stack Developer Intern', sub: 'Bridging Healthcare Technology, Mohali', badge: 'Internship Start' },
            { date: 'Jul 2025', title: 'Degree Completed', sub: 'CGPA 7.03 — J.C. Bose YMCA', badge: 'Graduated' },
            { date: 'Dec 2025', title: 'Associate Full Stack Developer', sub: 'Bridging Healthcare Technology · Full-time', badge: 'Current Role' },
          ].map((e, i) => (
            <div className="tl-item" key={i}>
              <div className="tl-dot" />
              <div className="tl-date">{e.date}</div>
              <div className="tl-title">{e.title}</div>
              <div className="tl-sub">{e.sub}</div>
              <span className="tl-badge">{e.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExperienceSection = () => {
  const ref = useScrollReveal();
  return (
    <section id="experience" className="section reveal" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Experience</div>
          <h2 className="section-title">Where I've <em>been building.</em></h2>
        </div>
        <div className="exp-list">
          {[
            {
              role: 'Associate Full Stack Developer',
              company: 'Bridging Healthcare Technology · Mohali, Punjab',
              period: 'Dec 2025 – Present',
              badge: 'Full-time',
              bullets: [
                'Implemented dynamic transaction fee calculation logic for credit cards, debit cards, and bank transfers — supporting 3+ payment modes with real-time fee updates.',
                'Owned end-to-end feedback, review, and referral workflows used across multiple user journeys in a fintech environment.',
                'Designed and optimized RESTful APIs with Express.js, reducing average response time by 20–30% under normal load.',
              ],
            },
            {
              role: 'Full Stack Developer Intern',
              company: 'Bridging Healthcare Technology · Mohali, Punjab',
              period: 'May – Dec 2025',
              badge: 'Internship · 7 months',
              bullets: [
                'Engineered responsive Angular components using Bootstrap, improving mobile usability across 10+ UI screens.',
                'Built advanced routing, state management, and reactive form validation, reducing invalid form submissions and improving user flow.',
                'Delivered 5+ end-to-end features in production, collaborating directly with senior engineers and product stakeholders.',
              ],
            },
          ].map((exp, i) => (
            <div className="exp-item" key={i}>
              <div>
                <div className="exp-period">{exp.period}</div>
                <div className="exp-company">{exp.company}</div>
                <span className="exp-badge">{exp.badge}</span>
              </div>
              <div>
                <h3 className="exp-role">{exp.role}</h3>
                <ul className="exp-bullets">
                  {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectsSection = () => {
  const ref = useScrollReveal();
  const projects = [
    {
      num: '01',
      title: 'Connect Now',
      description: 'Real-time one-to-one video chat app built with WebRTC and Socket.io. Features secure JWT authentication, dynamic user dashboards, and live signalling for peer connections.',
      tags: ['React', 'Node.js', 'WebRTC', 'Socket.io', 'MongoDB', 'JWT'],
      demo: 'https://connect-now-n3jl.vercel.app/', source: 'https://github.com/lakshayEXE/ConnectNow',
    },
    {
      num: '02',
      title: 'Live Polling System',
      description: 'Time-based real-time polling tool for educators and students with live result tracking and analytics. Optimized to handle 100+ concurrent users with real-time data sync.',
      tags: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
      demo: 'https://livepollingsystemlakshay.netlify.app/', source: 'https://github.com/lakshayEXE/live-polling-system',
    },
    {
      num: '03',
      title: 'ChatSphere',
      description: 'Full-stack Angular chat application with reactive forms, JWT authentication, WebSocket messaging, online presence indicators, and secure file uploads with live preview.',
      tags: ['Angular', 'Node.js', 'WebSocket', 'SQL', 'JWT', 'Multer'],
      source: 'https://github.com/lakshayEXE/full_stack_connection',
    },
    {
      num: '04',
      title: 'CodeFussion',
      description: 'Scrapped data from my coding profile Leetcode, GeeksforGeeks , Codechef and displayed it in a dashboard.',
      tags: ['Node.js', 'Puppeteer', 'Express', 'WebScrapping'],
      source: 'https://github.com/lakshayEXE/CodeFussion',
    },
  ];
  return (
    <section id="projects" className="section reveal" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Selected Work</div>
          <h2 className="section-title">Things I've <em>shipped.</em></h2>
        </div>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <SpotlightCard key={i}>
              <div className="project-num">Project {p.num}</div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.description}</p>
              <div className="tech-tags">{p.tags.map((t, j) => <span className="tag" key={j}>{t}</span>)}</div>
              <div className="project-links">
                <a href={p.source} className="project-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                  Source
                </a>
                {p.demo && (
                  <a href={p.demo} className="project-link" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Live Demo
                  </a>
                )}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillsSection = () => {
  const ref = useScrollReveal();
  return (
    <section id="skills" className="section reveal" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Skills & Expertise</div>
          <h2 className="section-title">My <em>toolkit.</em></h2>
        </div>
        <div className="skills-grid">
          {[
            { label: 'Frontend', skills: ['Angular', 'React.js', 'TypeScript', 'JavaScript ES6+', 'HTML5 & CSS3', 'Bootstrap', 'Tailwind CSS', 'D3.js'] },
            { label: 'Backend', skills: ['Node.js', 'Express.js', 'REST APIs', 'JWT', 'WebSocket', 'Socket.io', 'WebRTC', 'Puppeteer', 'Stripe SDK', 'AWS'] },
            { label: 'Databases & Tools', skills: ['SQL', 'MongoDB', 'XAMPP', 'Postman', 'Git', 'GitHub', 'Jenkins'] },
            { label: 'Languages', skills: ['JavaScript', 'TypeScript', 'C++', 'SQL'] },
          ].map((g, i) => (
            <div className="skill-group" key={i}>
              <div className="skill-group-label">{g.label}</div>
              <div className="skill-pills">{g.skills.map((s, j) => <span className="skill-pill" key={j}>{s}</span>)}</div>
            </div>
          ))}
          <div className="cp-group">
            <div className="skill-group-label">Competitive Programming & CS Fundamentals</div>
            <div className="cp-group-title">Algorithmic Problem Solving</div>
            <p className="cp-group-desc">
              Passionate about data structures, algorithms, and systems. Strong foundation in DSA, DBMS, OS, and OOP. Ranked 15th out of 510,000 participants in Naukri Campus Young Turks 2024.
            </p>
            <div className="cp-stats-row">
              <div className="cp-stat"><div className="cp-stat-num">500+</div><div className="cp-stat-label">Problems across platforms</div></div>
              <div className="cp-stat"><div className="cp-stat-num">15th</div><div className="cp-stat-label">Young Turks 2024 (coding)</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const EducationSection = () => {
  const ref = useScrollReveal();
  const certs = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="12" r="3" /><path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: 'Full Stack Web Development',
      issuer: '100xDevs · Harkirat Singh'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2" /><path d="M12 12m-9-4q9-4 18 0" /><path d="M12 12m-9 4q9 4 18 0" /><path d="M12 12m-4-9q4 9 0 18" /><path d="M12 12m4-9q-4 9 0 18" />
        </svg>
      ),
      title: 'React.js — Complete Guide',
      issuer: 'Self-paced'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" /><path d="m9 12 3 3 3-3" />
        </svg>
      ),
      title: 'Node.js — The Complete Course',
      issuer: 'Self-paced'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 12h-4v4m0-4 4 4" /><path d="M4 8h8" /><path d="M8 8v8" />
        </svg>
      ),
      title: 'TypeScript — Deep Dive',
      issuer: 'Self-paced'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 2 5l2 14 8 3 8-3 2-14-10-3z" /><path d="m9 15 3-8 3 8" /><path d="M10 13h4" />
        </svg>
      ),
      title: 'Angular — Full Course',
      issuer: 'Self-paced'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" /><path d="m16 8 4 4-4 4" /><path d="m8 8-4 4 4 4" />
        </svg>
      ),
      title: 'C++ for Competitive Programming',
      issuer: 'Self-paced'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: 'Data Structures & Algorithms',
      issuer: 'Self-paced'
    },
  ];
  const achievements = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
      title: 'Naukri Young Turks 2024',
      desc: 'Ranked 15th out of 510,000 participants in the coding domain competition.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z" />
        </svg>
      ),
      title: 'KRMU Hackathon 2023 — 1st Place',
      desc: 'Secured 1st position (category-wise) with an innovative full-stack web application.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="12 22 12 13 20 9.5" />
        </svg>
      ),
      title: 'CTF Aravali College 2023 — 2nd Place',
      desc: 'Secured 2nd position in Capture The Flag, demonstrating cybersecurity skills.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      title: '500+ Problems Solved',
      desc: 'Consistent competitive programmer across LeetCode and GeeksforGeeks.'
    },
  ];
  return (
    <section id="education" className="section reveal" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Education</div>
          <h2 className="section-title">Where I <em>studied.</em></h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
          <div className="edu-card">
            <div>
              <div className="edu-degree">B.Tech — Electronics &amp; Computer Engineering</div>
              <div className="edu-uni">J.C. Bose University of Science &amp; Technology, YMCA</div>
              <div className="edu-loc">Faridabad, Haryana · CGPA 7.03</div>
            </div>
            <div className="edu-right">
              <div className="edu-year">2025</div>
              <div className="edu-status">Completed</div>
            </div>
          </div>
          <div className="edu-card">
            <div>
              <div className="edu-degree">Higher Secondary — Class XII</div>
              <div className="edu-uni">Arya Senior Secondary School, CBSE Board</div>
              <div className="edu-loc">Percentage: 92%</div>
            </div>
            <div className="edu-right">
              <div className="edu-year">2020</div>
              <div className="edu-status">Completed</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div className="eyebrow">Achievements</div>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem,3vw,2.1rem)', marginBottom: '2rem' }}>Awards & <em>recognition.</em></h2>
          <div className="achievements-grid">
            {achievements.map((a, i) => (
              <div className="ach-card" key={i}>
                <div className="ach-icon">{a.icon}</div>
                <div>
                  <div className="ach-title">{a.title}</div>
                  <div className="ach-desc">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '4rem', marginBottom: '2rem' }}>
          <div className="eyebrow">Certifications</div>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem,3vw,2.1rem)', marginBottom: '2rem' }}>Courses &amp; <em>credentials.</em></h2>
        </div>
        <div className="certs-grid">
          {certs.map((c, i) => (
            <div className="cert-card" key={i}>
              <div className="cert-icon">{c.icon}</div>
              <div className="cert-title">{c.title}</div>
              <div className="cert-issuer">{c.issuer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com/lakshayEXE',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/lakshaybhatia2506',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  },
  {
    name: 'LeetCode',
    url: 'https://leetcode.com/u/lakshay_bhatia/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5l-4.5-4.5 1.41-1.41L11 14.67l6.59-6.59 1.41 1.41L11 17.5z" />
      </svg>
    )
  }
];

const ContactSection = () => {
  const ref = useScrollReveal();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('lakshaybhatia0426@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="footer reveal" ref={ref}>
      <div className="footer-bg" />
      <div className="footer-inner container">
        <span className="footer-label">Contact</span>
        <h2>Let's build something <em>great together.</em></h2>

        <div className="email-container">
          <a href="mailto:lakshaybhatia0426@gmail.com" className="email-btn">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            lakshaybhatia0426@gmail.com
          </a>
          <button onClick={handleCopyEmail} className="copy-btn" aria-label="Copy email address">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="socials">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit my ${social.name} profile`}
            >
              {social.icon}
              <span>{social.name}</span>
            </a>
          ))}
        </div>

        <p className="footer-copy">© {new Date().getFullYear()} Lakshay Bhatia — Designed &amp; built with care.</p>
      </div>
    </footer>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <>
      <style>{globalStyles}</style>
      <Navbar isDark={isDark} toggleTheme={() => setIsDark(d => !d)} />
      <main>
        <HeroSection />
        <StatsBar />
        <TimelineSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
      </main>
      <ContactSection />
    </>
  );
}