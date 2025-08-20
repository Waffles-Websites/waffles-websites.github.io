(function(){
  // ---------- helpers ----------
  function fmtDate(dt){
    const optsDate = { weekday:'long', month:'long', day:'numeric' };
    const optsTime = { hour:'numeric', minute:'2-digit' };
    return `${dt.toLocaleDateString(undefined, optsDate)} · ${dt.toLocaleTimeString(undefined, optsTime)}`;
  }
  function toUTCStamp(epoch){
    const d = new Date(epoch*1000);
    const pad = n => String(n).padStart(2,'0');
    return d.getUTCFullYear()
      + pad(d.getUTCMonth()+1)
      + pad(d.getUTCDate())
      + 'T'
      + pad(d.getUTCHours())
      + pad(d.getUTCMinutes())
      + pad(d.getUTCSeconds()) + 'Z';
  }

  // ---------- local time rendering ----------
  function localizeTimes(){
    document.querySelectorAll('time.js-localtime[data-epoch]').forEach(el=>{
      const epoch = parseInt(el.dataset.epoch, 10);
      if (isNaN(epoch)) return;
      const dt = new Date(epoch * 1000);
      el.textContent = fmtDate(dt);
      el.setAttribute('datetime', dt.toISOString());
    });
  }

  // ---------- filter chips ----------
  function initFilters(){
    const root = document.querySelector('.events-pro[data-enhance="events"]');
    if(!root) return;
    const buttons = root.querySelectorAll('.events-filters [data-filter]');
    const items = root.querySelectorAll('.event-item');
    if(!buttons.length) return;

    function apply(filter){
      items.forEach(it=>{
        const tags = (it.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
        const show = (filter === 'all') || tags.includes(filter);
        it.style.display = show ? '' : 'none';
      });
    }

    buttons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        buttons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        apply(btn.getAttribute('data-filter'));
      });
    });
  }

  // ---------- Add to Google Calendar ----------
  function initGoogleButtons(){
    document.addEventListener('click', e=>{
      const btn = e.target.closest('.js-gcal');
      if(!btn) return;
      const title = btn.dataset.title || '';
      const start = parseInt(btn.dataset.start, 10);
      const end   = parseInt(btn.dataset.end, 10) || (start + 5400);
      const location = btn.dataset.location || '';
      const desc = btn.dataset.desc || '';
      if (isNaN(start)) return;

      const base = 'https://www.google.com/calendar/render?action=TEMPLATE';
      const url = base
        + '&text=' + encodeURIComponent(title)
        + '&dates=' + toUTCStamp(start) + '%2F' + toUTCStamp(end)
        + '&location=' + encodeURIComponent(location)
        + '&details=' + encodeURIComponent(desc);

      window.open(url, '_blank', 'noopener');
    });
  }

  // ---------- per-event .ics download ----------
  function initICS(){
    function pad(n){ return String(n).padStart(2,'0'); }
    function toUTC(epoch){
      const d = new Date(epoch*1000);
      return d.getUTCFullYear()
        + pad(d.getUTCMonth()+1)
        + pad(d.getUTCDate())
        + 'T'
        + pad(d.getUTCHours())
        + pad(d.getUTCMinutes())
        + pad(d.getUTCSeconds()) + 'Z';
    }
    function makeICS({title,start,end,location,desc}){
      const lines = [
        'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Cedar Grove Christian//Events//EN',
        'CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
        'UID:' + Date.now() + '-' + Math.random().toString(36).slice(2) + '@cedargrove',
        'DTSTAMP:' + toUTC(Date.now()/1000),
        'DTSTART:' + toUTC(parseInt(start,10)),
        'DTEND:'   + toUTC(parseInt(end,10)),
        'SUMMARY:' + (title||''),
        'DESCRIPTION:' + (desc||'').replace(/\n/g,' '),
        'LOCATION:' + (location||''),
        'END:VEVENT','END:VCALENDAR'
      ];
      return new Blob([lines.join('\r\n')], {type:'text/calendar'});
    }
    document.addEventListener('click', e=>{
      const btn = e.target.closest('.js-ics');
      if(!btn) return;
      const data = {
        title: btn.dataset.title,
        start: btn.dataset.start,
        end:   btn.dataset.end,
        location: btn.dataset.location,
        desc:  btn.dataset.desc
      };
      const blob = makeICS(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = (data.title||'event') + '.ics';
      document.body.appendChild(a);
      a.click();
      setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 800);
    });
  }

  // ---------- init ----------
  document.addEventListener('DOMContentLoaded', function(){
    localizeTimes();
    initGoogleButtons();
    initFilters();
    initICS();
  });
})();
