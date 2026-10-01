import os
import re
import json
import urllib.parse
from catalog_data import PRODUCTS

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 1. GENERATE js/data/products.js
def update_js_products():
    js_path = os.path.join(ROOT_DIR, "js", "data", "products.js")
    
    lines = [
        "/**",
        " * Catálogo ampliado y categorizado para El Ferretero (50 productos)",
        " */",
        "",
        "export const SVG_PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(`",
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">',
        '  <rect width="400" height="300" fill="#202020"/>',
        '  <rect x="20" y="20" width="360" height="260" rx="8" fill="none" stroke="#333333" stroke-width="2" stroke-dasharray="8 8"/>',
        '  <g fill="none" stroke="#F5A000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">',
        '    <path d="M222 108a34 34 0 0 0-46 46l-58 58 22 22 58-58a34 34 0 0 0 46-46l-22 22-20-6-6-20z"/>',
        '  </g>',
        '  <text x="200" y="245" fill="#888888" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle" letter-spacing="1">EL FERRETERO · RÍO CUARTO</text>',
        "</svg>",
        "`);",
        "",
        "export const CATEGORIAS_TIENDA = [",
        '  { id: "mantenimiento-limpieza", nombre: "Mantenimiento y Limpieza del Hogar", slug: "mantenimiento-limpieza.html" },',
        '  { id: "electricidad", nombre: "Electricidad", slug: "electricidad.html" },',
        '  { id: "libros-ebook", nombre: "Libros / E-Book", slug: "libros-ebook.html" },',
        '  { id: "herramienta-seguridad", nombre: "Herramienta Seguridad", slug: "herramienta-seguridad.html" },',
        '  { id: "mayorista-combos", nombre: "Mayorista Combos", slug: "mayorista-combos.html" }',
        "];",
        "",
        "export const PRODUCTOS = ["
    ]
    
    sections = [
        ("mantenimiento-limpieza", "MANTENIMIENTO Y LIMPIEZA DEL HOGAR"),
        ("electricidad", "ELECTRICIDAD"),
        ("libros-ebook", "LIBROS / E-BOOK"),
        ("herramienta-seguridad", "HERRAMIENTA SEGURIDAD"),
        ("mayorista-combos", "MAYORISTA COMBOS")
    ]
    
    for cat_id, cat_title in sections:
        lines.append(f"  /* --- {cat_title} --- */")
        cat_prods = [p for p in PRODUCTS if p["categoriaId"] == cat_id]
        for idx, p in enumerate(cat_prods):
            lines.append("  {")
            lines.append(f'    id: {json.dumps(p["id"])},')
            lines.append(f'    nombre: {json.dumps(p["nombre"])},')
            lines.append(f'    categoriaId: {json.dumps(p["categoriaId"])},')
            lines.append(f'    categoriaNombre: {json.dumps(p["categoriaNombre"])},')
            lines.append(f'    desc: {json.dumps(p["desc"])},')
            lines.append(f'    precio: {p["precio"]},')
            lines.append(f'    precioFormateado: {json.dumps(p["precioFormateado"])},')
            lines.append(f'    antes: {json.dumps(p["antes"])},')
            lines.append(f'    oferta: {json.dumps(p["oferta"])},')
            lines.append(f'    imagen: {json.dumps(p["imagen"])}')
            lines.append("  }" + ("," if idx < len(cat_prods) - 1 or cat_id != sections[-1][0] else ""))
    
    lines.append("];")
    lines.append("")
    
    content = "\n".join(lines)
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {js_path} with {len(PRODUCTS)} products.")

# 2. GENERATE api/products.js
def update_api_products():
    api_path = os.path.join(ROOT_DIR, "api", "products.js")
    with open(api_path, "r", encoding="utf-8") as f:
        existing_code = f.read()
    
    # Split before module.exports
    handler_idx = existing_code.find("module.exports = function handler")
    if handler_idx == -1:
        raise Exception("Handler not found in api/products.js")
    
    handler_code = existing_code[handler_idx:]
    
    lines = [
        "/**",
        " * El Ferretero - REST API: Catálogo de Productos",
        " * Compatible con Vercel Serverless Functions y Node.js vanilla",
        " */",
        "",
        "const PRODUCTOS = ["
    ]
    
    sections = [
        ("mantenimiento-limpieza", "MANTENIMIENTO Y LIMPIEZA DEL HOGAR"),
        ("electricidad", "ELECTRICIDAD"),
        ("libros-ebook", "LIBROS / E-BOOK"),
        ("herramienta-seguridad", "HERRAMIENTA SEGURIDAD"),
        ("mayorista-combos", "MAYORISTA COMBOS")
    ]
    
    for cat_id, cat_title in sections:
        lines.append(f"  /* --- {cat_title} --- */")
        cat_prods = [p for p in PRODUCTS if p["categoriaId"] == cat_id]
        for idx, p in enumerate(cat_prods):
            lines.append("  {")
            lines.append(f'    id: {json.dumps(p["id"])},')
            lines.append(f'    nombre: {json.dumps(p["nombre"])},')
            lines.append(f'    categoriaId: {json.dumps(p["categoriaId"])},')
            lines.append(f'    categoriaNombre: {json.dumps(p["categoriaNombre"])},')
            lines.append(f'    desc: {json.dumps(p["desc"])},')
            lines.append(f'    precio: {p["precio"]},')
            lines.append(f'    precioFormateado: {json.dumps(p["precioFormateado"])},')
            lines.append(f'    antes: {json.dumps(p["antes"])},')
            lines.append(f'    oferta: {json.dumps(p["oferta"])},')
            lines.append(f'    imagen: {json.dumps(p["imagen"])},')
            lines.append(f'    destacado: {"true" if p["destacado"] else "false"},')
            lines.append(f'    stock: {"true" if p["stock"] else "false"}')
            lines.append("  }" + ("," if idx < len(cat_prods) - 1 or cat_id != sections[-1][0] else ""))
    
    lines.append("];")
    lines.append("")
    
    new_content = "\n".join(lines) + "\n" + handler_code
    with open(api_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated {api_path} with {len(PRODUCTS)} products.")

def make_card_html(p):
    import html as html_lib
    safe_name = html_lib.escape(p['nombre'])
    safe_desc = html_lib.escape(p['desc'])
    wa_text = urllib.parse.quote(f"Hola! Quiero consultar por {p['nombre']}")
    return f"""          <!-- {safe_name} -->
          <article class="promo" data-id="{p['id']}" data-category="{p['categoriaId']}">
            <span class="tag">{p['oferta']}</span>
            <div class="ph">
              <img src="{p['imagen']}" alt="{safe_name}" loading="lazy">
            </div>
            <div class="body">
              <div class="body-header"><span class="category-tag">{p['categoriaNombre']}</span></div>
              <h3>{safe_name}</h3>
              <p class="desc">{safe_desc}</p>
              <div class="price"><b>{p['precioFormateado']}</b><s>{p['antes']}</s></div>
              <div class="card-actions">
                <button class="btn-add-cart" data-action="add-cart" data-product-id="{p['id']}">Sumar al pedido</button>
                <a class="btn-wa-single" aria-label="Consultar por este producto en WhatsApp" href="https://wa.me/5493584238976?text={wa_text}" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.5 11.5 0 0 1-4.8-4.2c-.4-.5-1.2-1.6-1.2-3s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.4.1.1.1.7-.1 1.2z"/></svg>
                </a>
              </div>
            </div>
          </article>"""

# 3. UPDATE productos.html
def update_productos_html():
    file_path = os.path.join(ROOT_DIR, "productos.html")
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Update chips
    old_chips_regex = r'<div class="category-chips"[^>]*>[\s\S]*?</div>'
    new_chips = """<div class="category-chips" id="categoryChips" style="margin-bottom: 24px;">
          <a class="chip active" href="productos.html" data-category="todos">Todos (50)</a>
          <a class="chip" href="mantenimiento-limpieza.html" data-category="mantenimiento-limpieza">Mantenimiento y Limpieza (15)</a>
          <a class="chip" href="electricidad.html" data-category="electricidad">Electricidad (8)</a>
          <a class="chip" href="libros-ebook.html" data-category="libros-ebook">Libros / E-Book (4)</a>
          <a class="chip" href="herramienta-seguridad.html" data-category="herramienta-seguridad">Herramienta Seguridad (19)</a>
          <a class="chip" href="mayorista-combos.html" data-category="mayorista-combos">Mayorista Combos (4)</a>
        </div>"""
    html = re.sub(old_chips_regex, new_chips, html, count=1)
    
    # Replace grid content
    all_cards = "\n\n".join([make_card_html(p) for p in PRODUCTS])
    grid_regex = r'(<div class="grid">)[\s\S]*?(</div>\s*</div>\s*</section>)'
    replacement = r'\1\n' + all_cards + r'\n        \2'
    html = re.sub(grid_regex, replacement, html, count=1)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Updated productos.html with 50 products.")

# 4. UPDATE CATEGORY PAGES
def update_category_page(filename, cat_id, cat_expected_count, chips_html):
    file_path = os.path.join(ROOT_DIR, filename)
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Update chips
    old_chips_regex = r'<div class="category-chips"[^>]*>[\s\S]*?</div>'
    html = re.sub(old_chips_regex, chips_html, html, count=1)
    
    # Replace grid content with only items in this category
    cat_prods = [p for p in PRODUCTS if p["categoriaId"] == cat_id]
    if len(cat_prods) != cat_expected_count:
        raise Exception(f"Mismatch for {filename}: expected {cat_expected_count}, got {len(cat_prods)}")
    
    cards = "\n\n".join([make_card_html(p) for p in cat_prods])
    grid_regex = r'(<div class="grid">)[\s\S]*?(</div>\s*</div>\s*</section>)'
    replacement = r'\1\n' + cards + r'\n        \2'
    html = re.sub(grid_regex, replacement, html, count=1)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Updated {filename} with {len(cat_prods)} products.")

def update_all_categories():
    chips_mantenimiento = """<div class="category-chips" style="margin-bottom: 24px;">
          <a class="chip" href="productos.html">← Ver todos (50)</a>
          <a class="chip active" href="mantenimiento-limpieza.html">Mantenimiento y Limpieza (15)</a>
          <a class="chip" href="electricidad.html">Electricidad (8)</a>
          <a class="chip" href="herramienta-seguridad.html">Herramienta Seguridad (19)</a>
          <a class="chip" href="libros-ebook.html">Libros / E-Book (4)</a>
          <a class="chip" href="mayorista-combos.html">Mayorista Combos (4)</a>
        </div>"""
    update_category_page("mantenimiento-limpieza.html", "mantenimiento-limpieza", 15, chips_mantenimiento)
    
    chips_electricidad = """<div class="category-chips" style="margin-bottom: 24px;">
          <a class="chip" href="productos.html">← Ver todos (50)</a>
          <a class="chip" href="mantenimiento-limpieza.html">Mantenimiento y Limpieza (15)</a>
          <a class="chip active" href="electricidad.html">Electricidad (8)</a>
          <a class="chip" href="herramienta-seguridad.html">Herramienta Seguridad (19)</a>
          <a class="chip" href="libros-ebook.html">Libros / E-Book (4)</a>
          <a class="chip" href="mayorista-combos.html">Mayorista Combos (4)</a>
        </div>"""
    update_category_page("electricidad.html", "electricidad", 8, chips_electricidad)
    
    chips_herramienta = """<div class="category-chips" style="margin-bottom: 24px;">
          <a class="chip" href="productos.html">← Ver todos (50)</a>
          <a class="chip active" href="herramienta-seguridad.html">Herramienta Seguridad (19)</a>
          <a class="chip" href="mantenimiento-limpieza.html">Mantenimiento y Limpieza (15)</a>
          <a class="chip" href="electricidad.html">Electricidad (8)</a>
          <a class="chip" href="libros-ebook.html">Libros / E-Book (4)</a>
          <a class="chip" href="mayorista-combos.html">Mayorista Combos (4)</a>
        </div>"""
    update_category_page("herramienta-seguridad.html", "herramienta-seguridad", 19, chips_herramienta)
    
    chips_libros = """<div class="category-chips" style="margin-bottom: 24px;">
          <a class="chip" href="productos.html">← Ver todos (50)</a>
          <a class="chip" href="mantenimiento-limpieza.html">Mantenimiento y Limpieza (15)</a>
          <a class="chip" href="electricidad.html">Electricidad (8)</a>
          <a class="chip" href="herramienta-seguridad.html">Herramienta Seguridad (19)</a>
          <a class="chip active" href="libros-ebook.html">Libros / E-Book (4)</a>
          <a class="chip" href="mayorista-combos.html">Mayorista Combos (4)</a>
        </div>"""
    update_category_page("libros-ebook.html", "libros-ebook", 4, chips_libros)
    
    chips_mayorista = """<div class="category-chips" style="margin-bottom: 24px;">
          <a class="chip" href="productos.html">← Ver todos (50)</a>
          <a class="chip active" href="mayorista-combos.html">Mayorista Combos (4)</a>
          <a class="chip" href="mantenimiento-limpieza.html">Mantenimiento y Limpieza (15)</a>
          <a class="chip" href="electricidad.html">Electricidad (8)</a>
          <a class="chip" href="herramienta-seguridad.html">Herramienta Seguridad (19)</a>
          <a class="chip" href="libros-ebook.html">Libros / E-Book (4)</a>
        </div>"""
    update_category_page("mayorista-combos.html", "mayorista-combos", 4, chips_mayorista)

# 5. UPDATE test_suite.py
def update_test_suite():
    ts_path = os.path.join(ROOT_DIR, "test_suite.py")
    with open(ts_path, "r", encoding="utf-8") as f:
        ts = f.read()
    
    # 50 Product Images
    img_list = sorted([os.path.basename(p["imagen"]) for p in PRODUCTS])
    img_list_str = "PRODUCT_IMAGES = [\n" + ",\n".join([f'    "{img}"' for img in img_list]) + "\n]"
    ts = re.sub(r'PRODUCT_IMAGES = \[[^\]]*\]', img_list_str, ts, count=1)
    
    # 21 -> 50 in comments and assertions
    ts = ts.replace("Catalogo JS contiene exactamente 21 productos", "Catalogo JS contiene exactamente 50 productos")
    ts = ts.replace("len(product_ids) == 21", "len(product_ids) == 50")
    ts = ts.replace("productos.html contiene exactamente 21 productos", "productos.html contiene exactamente 50 productos")
    ts = ts.replace("len(html_ids) == 21", "len(html_ids) == 50")
    ts = ts.replace("GET /api/products catalogo completo 21 items", "GET /api/products catalogo completo 50 items")
    ts = ts.replace('data.get("total") == 21', 'data.get("total") == 50')
    
    # Update cat_expected in test_suite.py
    old_cat_expected = """cat_expected = {
    'electricidad.html': 4,
    'mantenimiento-limpieza.html': 4,
    'herramienta-seguridad.html': 5,
    'libros-ebook.html': 4,
    'mayorista-combos.html': 4
}"""
    new_cat_expected = """cat_expected = {
    'electricidad.html': 8,
    'mantenimiento-limpieza.html': 15,
    'herramienta-seguridad.html': 19,
    'libros-ebook.html': 4,
    'mayorista-combos.html': 4
}"""
    ts = ts.replace(old_cat_expected, new_cat_expected)
    
    # Update categorias_api in test_suite.py
    old_api_cats = """    categorias_api = [
        ("electricidad", 4),
        ("limpieza", 4),
        ("herramientas", 5),
        ("libros", 4),
        ("combos", 4)
    ]"""
    new_api_cats = """    categorias_api = [
        ("electricidad", 8),
        ("limpieza", 15),
        ("herramientas", 19),
        ("libros", 4),
        ("combos", 4)
    ]"""
    ts = ts.replace(old_api_cats, new_api_cats)
    
    with open(ts_path, "w", encoding="utf-8") as f:
        f.write(ts)
    print("Updated test_suite.py.")

if __name__ == "__main__":
    update_js_products()
    update_api_products()
    update_productos_html()
    update_all_categories()
    update_test_suite()
    print("\nALL UPDATES COMPLETED SUCCESSFULLY!")
