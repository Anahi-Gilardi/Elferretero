"""
El Ferretero - Suite de Pruebas Automatizadas Integrales
Valida frontend, backend, responsive, imágenes, PWA, SEO, accesibilidad y APIs.
"""

import sys
import os
import json
import time
import re
import subprocess
import urllib.request
import urllib.error
import urllib.parse

# Configurar stdout para evitar errores de codificación en Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

PAGES = [
    "index.html",
    "productos.html",
    "contacto.html",
    "electricidad.html",
    "herramienta-seguridad.html",
    "mantenimiento-limpieza.html",
    "mayorista-combos.html"
]

PRODUCT_IMAGES = [
    "adhesivo-montaje-pulpito.jpg",
    "adhesivo-pvc-250.jpg",
    "amoladora-4-1-2.jpg",
    "antiparras-seguridad.jpg",
    "arco-sierra-metales.jpg",
    "arnes-seguridad.jpg",
    "aspiradora-20l.jpg",
    "balde-albanil-reforzado.jpg",
    "canilla-esferica-1-2.jpg",
    "cano-corrugado-3-4.jpg",
    "casco-seguridad.jpg",
    "cinta-aisladora-tacsa.jpg",
    "cinta-metrica-5m.jpg",
    "cinta-papel-enmascarar.jpg",
    "cinta-teflon-3-4.jpg",
    "clavos-punta-paris.jpg",
    "combo-albanileria.jpg",
    "combo-duo-power.jpg",
    "combo-electricista.jpg",
    "cuchara-albanil-7.jpg",
    "disco-diamantado-115.jpg",
    "escalera-aluminio-5.jpg",
    "espuma-poliuretano-500ml.jpg",
    "flexible-mallado-1-2.jpg",
    "hidrolavadora-1400w.jpg",
    "juego-destornilladores-x6.jpg",
    "llave-francesa-10.jpg",
    "martillo-galponero.jpg",
    "mopa-giratoria-360.jpg",
    "nivel-aluminio-40cm.jpg",
    "pack-discos-corte.jpg",
    "pack-led-9w-x10.jpg",
    "pinza-universal-8.jpg",
    "punto-toma-armado.jpg",
    "reflector-led-50w.jpg",
    "remaches-aluminio-ciegos.jpg",
    "rollo-cable-2-5.jpg",
    "sellador-acrilico-grietas.jpg",
    "silicona-neutra-transparente.jpg",
    "tablero-termicas.jpg",
    "taladro-650w.jpg",
    "tarugos-nylon-8.jpg",
    "tester-multimetro.jpg",
    "tornillos-drywall-t2.jpg",
    "tornillos-t1-aguja.jpg",
    "tubo-termofusion-20mm.jpg"
]

STORE_IMAGES = [
    os.path.join("img", "banners", "hero-ferreteria.jpg"),
    os.path.join("img", "local", "fachada-local.jpg")
]

passed = 0
failed = 0

def check(name, condition, extra=""):
    global passed, failed
    if condition:
        print(f"  [OK] {name} {extra}")
        passed += 1
    else:
        print(f"  [FAIL] {name} {extra}")
        failed += 1

print("\n" + "="*60)
print("🛠️  EJECUTANDO SUITE DE PRUEBAS - EL FERRETERO (RÍO CUARTO)")
print("="*60)

# 1. Validación de Archivos HTML, SEO, Metadatos y Accesibilidad
print("\n[1] Verificando Páginas HTML, Meta Responsive, PWA, SEO y A11y...")
for page in PAGES:
    path = os.path.join(ROOT_DIR, page)
    exists = os.path.isfile(path)
    check(f"Archivo {page} existe", exists)
    if exists:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            check(f"{page} tiene viewport responsive", 'name="viewport"' in content)
            check(f"{page} tiene manifest PWA", 'manifest.json' in content)
            check(f"{page} carga app.js", 'js/app.js' in content)
            check(f"{page} tiene telefono 358 423-8976", '358 423-8976' in content or '3584238976' in content)
            check(f"{page} tiene direccion San Martin 2395", 'San Martín 2395' in content or 'San Martin 2395' in content)
            check(f"{page} tiene canonical link", '<link rel="canonical"' in content)
            check(f"{page} tiene OpenGraph title y descripcion", 'property="og:title"' in content and 'property="og:description"' in content)
            check(f"{page} tiene cart-drawer accesible con role dialog", 'id="cartDrawer"' in content and 'role="dialog"' in content)
            check(f"{page} tiene fieldset y legend en cart-drawer", '<fieldset class="cart-delivery-opt"' in content and '<legend class="delivery-label"' in content)
            check(f"{page} tiene campo de direccion/notas en cart-drawer", 'id="cartDeliveryAddress"' in content)
            if page not in ["contacto.html"]:
                check(f"{page} tiene data-category en productos", 'data-category=' in content)
            if page not in ["index.html", "contacto.html"]:
                check(f"{page} tiene category-chips de navegacion", 'category-chips' in content)

# 2. Validación de SEO Técnico: robots.txt y sitemap.xml y 404.html
print("\n[2] Verificando SEO Tecnico (robots.txt, sitemap.xml, 404.html)...")
robots_path = os.path.join(ROOT_DIR, "robots.txt")
check("robots.txt existe", os.path.isfile(robots_path))
if os.path.isfile(robots_path):
    with open(robots_path, "r", encoding="utf-8") as f:
        r_txt = f.read()
        check("robots.txt permite rastreo", "Allow: /" in r_txt)
        check("robots.txt apunta a sitemap.xml", "sitemap.xml" in r_txt)

sitemap_path = os.path.join(ROOT_DIR, "sitemap.xml")
check("sitemap.xml existe", os.path.isfile(sitemap_path))
if os.path.isfile(sitemap_path):
    with open(sitemap_path, "r", encoding="utf-8") as f:
        s_txt = f.read()
        for p in PAGES:
            check(f"sitemap.xml incluye {p}", p in s_txt or (p == "index.html" and "https://el-ferretero.vercel.app/" in s_txt))

not_found_path = os.path.join(ROOT_DIR, "404.html")
check("404.html existe", os.path.isfile(not_found_path))
if os.path.isfile(not_found_path):
    with open(not_found_path, "r", encoding="utf-8") as f:
        nf_txt = f.read()
        check("404.html contiene enlaces a todas las secciones", "electricidad.html" in nf_txt and "productos.html" in nf_txt)

# 3. Validación de Integridad de Imágenes (21 Productos + Banners)
print("\n[3] Verificando Integridad de Imágenes (21 Productos + Banners)...")
for img_name in PRODUCT_IMAGES:
    img_path = os.path.join(ROOT_DIR, "img", "productos", img_name)
    exists = os.path.isfile(img_path)
    size = os.path.getsize(img_path) if exists else 0
    check(f"Imagen producto {img_name}", exists and size > 1000, f"({round(size/1024, 1)} KB)")

for store_img in STORE_IMAGES:
    img_path = os.path.join(ROOT_DIR, store_img)
    exists = os.path.isfile(img_path)
    size = os.path.getsize(img_path) if exists else 0
    check(f"Imagen tienda {store_img}", exists and size > 5000, f"({round(size/1024, 1)} KB)")

# 4. Validación de Consistencia de Catálogo (46 Productos)
print("\n[4] Verificando Consistencia del Catalogo (46 Productos)...")
with open(os.path.join(ROOT_DIR, "js", "data", "products.js"), "r", encoding="utf-8") as f:
    js_prod_code = f.read()

categories_order = ['mantenimiento-limpieza', 'electricidad', 'herramienta-seguridad', 'mayorista-combos']
all_ids = re.findall(r'id:\s*"([^"]+)"', js_prod_code)
product_ids = [i for i in all_ids if i not in categories_order]
check("Catalogo JS contiene exactamente 46 productos", len(product_ids) == 46)

with open(os.path.join(ROOT_DIR, "productos.html"), "r", encoding="utf-8") as f:
    prod_html = f.read()
html_ids = re.findall(r'data-id="([^"]+)"', prod_html)
check("productos.html contiene exactamente 46 productos", len(html_ids) == 46)
check("IDs de productos coinciden 100% entre JS y HTML", set(product_ids) == set(html_ids))

cat_expected = {
    'electricidad.html': 8,
    'mantenimiento-limpieza.html': 15,
    'herramienta-seguridad.html': 19,
    'mayorista-combos.html': 4
}
for cat_file, expected_count in cat_expected.items():
    with open(os.path.join(ROOT_DIR, cat_file), "r", encoding="utf-8") as f:
        cat_content = f.read()
    cat_items = re.findall(r'data-id="([^"]+)"', cat_content)
    check(f"{cat_file} contiene exactamente {expected_count} productos", len(cat_items) == expected_count)

# 5. Validación de PWA, Service Worker v2 y Vercel
print("\n[5] Verificando PWA, Service Worker v2 y Vercel Config...")
manifest_path = os.path.join(ROOT_DIR, "manifest.json")
try:
    with open(manifest_path, "r", encoding="utf-8") as f:
        m_json = json.load(f)
        check("manifest.json es JSON valido", True)
        check("manifest.json contiene short_name", m_json.get("short_name") == "El Ferretero")
except Exception as e:
    check("manifest.json es valido", False, str(e))

vercel_path = os.path.join(ROOT_DIR, "vercel.json")
try:
    with open(vercel_path, "r", encoding="utf-8") as f:
        v_json = json.load(f)
        check("vercel.json es JSON valido", True)
        check("vercel.json define cleanUrls", v_json.get("cleanUrls") is True)
        check("vercel.json define rewrites", len(v_json.get("rewrites", [])) >= 6)
        check("vercel.json define headers de seguridad", len(v_json.get("headers", [])) > 0)
except Exception as e:
    check("vercel.json es valido", False, str(e))

sw_path = os.path.join(ROOT_DIR, "sw.js")
check("sw.js existe", os.path.isfile(sw_path))
if os.path.isfile(sw_path):
    with open(sw_path, "r", encoding="utf-8") as f:
        sw_code = f.read()
        check("sw.js es version v2.2", "el-ferretero-v2.2" in sw_code)
        check("sw.js gestiona evento fetch", "addEventListener('fetch'" in sw_code)
        check("sw.js gestiona navegacion sin ERR_FAILED", "navigate" in sw_code)

# 6. Servidor Local y Endpoints REST API
print("\n[6] Levantando Servidor Node y Comprobando Endpoints API y Páginas...")
server_process = subprocess.Popen(
    ["node", "server.js"],
    cwd=ROOT_DIR,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

time.sleep(1.5)
BASE_URL = "http://127.0.0.1:8000"

try:
    # Test index.html
    req = urllib.request.Request(f"{BASE_URL}/")
    with urllib.request.urlopen(req) as resp:
        body = resp.read().decode("utf-8")
        check("GET / responde HTTP 200", resp.status == 200)
        check("GET / contiene titulo El Ferretero", "El Ferretero" in body)

    # Test /productos.html
    with urllib.request.urlopen(f"{BASE_URL}/productos.html") as resp:
        body = resp.read().decode("utf-8")
        check("GET /productos.html responde HTTP 200", resp.status == 200)
        check("GET /productos.html contiene filtro y productos", "category-chips" in body and "data-id=" in body)

    # Test /api/health
    with urllib.request.urlopen(f"{BASE_URL}/api/health") as resp:
        check("GET /api/health responde HTTP 200", resp.status == 200)
        data = json.loads(resp.read().decode("utf-8"))
        check("GET /api/health status healthy", data.get("status") == "healthy")
        check("GET /api/health contiene direccion", "San Martín 2395" in data.get("sucursal", {}).get("direccion", ""))
        check("GET /api/health reporta estado abierto/cerrado", "abierto" in data.get("sucursal", {}))

    # Test /api/products
    with urllib.request.urlopen(f"{BASE_URL}/api/products") as resp:
        check("GET /api/products responde HTTP 200", resp.status == 200)
        data = json.loads(resp.read().decode("utf-8"))
        check("GET /api/products catalogo completo 46 items", data.get("total") == 46)

    # Test /api/products por categorías
    categorias_api = [
        ("electricidad", 8),
        ("limpieza", 15),
        ("herramientas", 19),
        ("combos", 4)
    ]
    for cat_param, count_expected in categorias_api:
        with urllib.request.urlopen(f"{BASE_URL}/api/products?category={cat_param}") as resp:
            data = json.loads(resp.read().decode("utf-8"))
            check(f"GET /api/products?category={cat_param} filtra {count_expected} items", data.get("total") == count_expected)

    # Test /api/products?q=amoladora
    with urllib.request.urlopen(f"{BASE_URL}/api/products?q=amoladora") as resp:
        data = json.loads(resp.read().decode("utf-8"))
        check("GET /api/products?q=amoladora encuentra amoladora", data.get("total") >= 1)

    # Test POST /api/quote - Modalidad Retiro en local
    quote_payload_local = json.dumps({
        "cliente": "Marcos Prueba",
        "telefono": "3584230000",
        "entrega": "retiro",
        "items": [
            { "nombre": "Taladro Percutor 650W", "cantidad": 2, "precio": 64900 },
            { "nombre": "Casco de Seguridad", "cantidad": 1, "precio": 8500 }
        ],
        "mensaje": "Prueba retiro en local"
    }).encode("utf-8")

    req_quote = urllib.request.Request(
        f"{BASE_URL}/api/quote",
        data=quote_payload_local,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_quote) as resp:
        check("POST /api/quote (retiro) responde HTTP 200", resp.status == 200)
        q_data = json.loads(resp.read().decode("utf-8"))
        check("POST /api/quote genera cotizacionId COT-...", q_data.get("cotizacionId", "").startswith("COT-"))
        check("POST /api/quote calcula total correcto ($138.300)", q_data.get("total") == 138300)
        check("POST /api/quote mapea correctamente Retiro en local", "Retiro en local" in q_data.get("modalidadEntrega", ""))
        check("POST /api/quote genera whatsappUrl con destino 5493584238976", "5493584238976" in q_data.get("whatsappUrl", ""))

    # Test POST /api/quote - Modalidad Envío a domicilio
    quote_payload_envio = json.dumps({
        "cliente": "Ana Prueba",
        "telefono": "3584231111",
        "entrega": "domicilio",
        "items": [
            { "nombre": "Hidrolavadora 1400W", "cantidad": 1, "precio": 92500 }
        ]
    }).encode("utf-8")

    req_quote_envio = urllib.request.Request(
        f"{BASE_URL}/api/quote",
        data=quote_payload_envio,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_quote_envio) as resp:
        q_envio_data = json.loads(resp.read().decode("utf-8"))
        check("POST /api/quote mapea correctamente Envio a domicilio", "domicilio en Río Cuarto" in q_envio_data.get("modalidadEntrega", ""))

    # Test POST /api/quote - Modalidad Envío al interior del país
    quote_payload_interior = json.dumps({
        "cliente": "Carlos Prueba",
        "entrega": "interior",
        "items": [
            { "nombre": "Pack Mayorista Discos", "cantidad": 1, "precio": 32000 }
        ]
    }).encode("utf-8")

    req_quote_interior = urllib.request.Request(
        f"{BASE_URL}/api/quote",
        data=quote_payload_interior,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_quote_interior) as resp:
        q_int_data = json.loads(resp.read().decode("utf-8"))
        check("POST /api/quote mapea correctamente Envio al interior", "interior" in q_int_data.get("modalidadEntrega", ""))

    # [QA] Pruebas negativas y de seguridad (regresión de la auditoría QA)
    def http_status(method, path, body=None):
        data = body if isinstance(body, (bytes, type(None))) else json.dumps(body).encode("utf-8")
        req = urllib.request.Request(f"{BASE_URL}{path}", data=data, method=method,
                                     headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req) as r:
                return r.status, r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode("utf-8", "replace")

    st, body = http_status("POST", "/api/quote", {"items": [{"id": "hidrolavadora-1400w", "cantidad": 2, "precio": 1}]})
    check("[QA] POST /api/quote usa precio del servidor para id de catalogo (2 x $92.500)", st == 200 and json.loads(body).get("total") == 185000)
    invalid_payloads = [
        ("cantidad negativa", {"items": [{"nombre": "X", "cantidad": -3, "precio": 100}]}),
        ("cantidad no numerica", {"items": [{"nombre": "X", "cantidad": "abc", "precio": 100}]}),
        ("cantidad > 999", {"items": [{"nombre": "X", "cantidad": 5000, "precio": 100}]}),
        ("precio negativo", {"items": [{"nombre": "X", "cantidad": 1, "precio": -100}]}),
        ("items no es lista", {"items": {"a": 1}}),
        ("item nulo", {"items": [None]}),
        ("id inexistente", {"items": [{"id": "no-existe", "cantidad": 1}]}),
        ("pedido vacio", {"items": []}),
    ]
    for label, payload in invalid_payloads:
        st, _ = http_status("POST", "/api/quote", payload)
        check(f"[QA] POST /api/quote rechaza {label} (400)", st == 400, f"(HTTP {st})")
    st, _ = http_status("POST", "/api/quote", {"cliente": 12345, "items": [{"nombre": "X", "cantidad": 1, "precio": 10}]})
    check("[QA] POST /api/quote con cliente numerico no rompe el servidor", st in (200, 400), f"(HTTP {st})")
    st, _ = http_status("POST", "/api/quote", b"{json roto")
    check("[QA] POST /api/quote con JSON invalido responde 400", st == 400, f"(HTTP {st})")
    st, _ = http_status("POST", "/api/quote", b'{"notas":"' + b"a" * 100000 + b'"}')
    check("[QA] POST /api/quote rechaza payload > 64KB (413)", st == 413, f"(HTTP {st})")
    st, _ = http_status("DELETE", "/api/quote")
    check("[QA] DELETE /api/quote responde 405", st == 405, f"(HTTP {st})")
    st, _ = http_status("POST", "/api/products", {})
    check("[QA] POST /api/products responde 405", st == 405, f"(HTTP {st})")
    st, body = http_status("GET", "/api/products?q=termica")
    check("[QA] GET /api/products?q=termica encuentra productos sin tilde", st == 200 and json.loads(body).get("total", 0) >= 1)
    st, _ = http_status("GET", "/api/health")
    check("[QA] Servidor sigue vivo tras pruebas negativas", st == 200)
    for secret in ["/.git/config", "/.vercel/project.json", "/server.js", "/package.json", "/test_suite.py", "/scripts/catalog_data.py", "/api/quote.js", "/..%2f..%2fWindows/win.ini"]:
        st, _ = http_status("GET", secret)
        check(f"[QA] Archivo interno {secret} no se publica", st in (400, 403, 404), f"(HTTP {st})")

except Exception as err:
    check("Comunicacion HTTP con servidor local", False, str(err))

finally:
    server_process.terminate()
    server_process.wait()
    print("  [INFO] Servidor de prueba cerrado con exito.")

print("\n" + "="*60)
print(f"RESUMEN FINAL: {passed} PRUEBAS SUPERADAS, {failed} FALLIDAS")
print("="*60)

if failed > 0:
    sys.exit(1)
else:
    print("TODO EL SISTEMA FUNCIONA PERFECTAMENTE.")
    sys.exit(0)
