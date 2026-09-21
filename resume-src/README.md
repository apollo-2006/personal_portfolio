# Resume source

`resume.html` is the source for `public/abir-deol-resume.pdf`. Edit the HTML, then
regenerate the PDF with headless Chrome:

    google-chrome-stable --headless --disable-gpu --no-pdf-header-footer \
      --print-to-pdf=../public/abir-deol-resume.pdf resume.html

It is laid out to fit exactly one letter page. After any edit, check the page count
before committing:

    pdftoppm -png -r 80 ../public/abir-deol-resume.pdf /tmp/pg && ls /tmp/pg*

If a second page appears, cut text rather than shrinking the type further: the body
is already at 8.55pt.

The rendered PDF carries Chrome's user-agent string in `/Creator`. Both
`/Creator` and `/Producer` are rewritten to "Abir Deol" afterwards, padded with
trailing spaces so the byte length and therefore the xref table stay valid:

    python3 - <<'PY'
    import re
    p='../public/abir-deol-resume.pdf'; d=open(p,'rb').read(); n=len(d)
    def swap(d,k,v):
        m=re.search(rb'/'+k+rb'\s*\((?:[^()\\]|\\.)*\)',d); o=m.group(0)
        r=b'/'+k+b' ('+v+b')'; r+=b' '*(len(o)-len(r))
        return d[:m.start()]+r+d[m.end():]
    d=swap(d,b'Creator',b'Abir Deol'); d=swap(d,b'Producer',b'Abir Deol')
    assert len(d)==n; open(p,'wb').write(d)
    PY
