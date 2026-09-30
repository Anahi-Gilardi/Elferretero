"""
El Ferretero - Suite de Pruebas Automatizadas Integrales
Valida frontend, backend, responsive, imágenes, PWA y APIs.
"""

import sys
import os
import json
import time
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
    "libros-ebook.html",
    "mantenimiento-limpieza.html",
    "mayorista-combos.html"
]

PRODUCT_IMAGES = [
    "amoladora-4-1-2.jpg",
    "antiparras-seguridad.jpg",
    "arnes-seguridad.jpg",
    "aspiradora-20l.jpg",
    "casco-seguridad.jpg",
    "combo-albanileria.jpg",
    "combo-duo-power.jpg",
    "combo-electricista.jpg",
    "ebook-durlock.jpg",
    "ebook-electricidad.jpg",
    "ebook-herreria.jpg",
    "ebook-plomeria.jpg",
    "escalera-aluminio-5.jpg",
    "hidrolavadora-1400w.jpg",
    "mopa-giratoria-360.jpg",
    "pack-discos-corte.jpg",
    "reflector-led-50w.jpg",
    "rollo-cable-2-5.jpg",
    "tablero-termicas.jpg",
    "taladro-650w.jpg",
    "tester-multimetro.jpg"
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

# 1. Validación de Archivos HTML y Tags Clave
print("\n[1] Verificando Páginas HTML, Meta Responsive y PWA...")
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

# 2. Validación de Imágenes de Productos y Sucursal
print("\n[2] Verificando Integridad de Imágenes (21 Productos + Banners)...")
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

# 3. Validación de Archivos de Configuración y PWA
print("\n[3] Verificando PWA, Vercel y Package JSON...")
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
        check("vercel.json define headers de seguridad", len(v_json.get("headers", [])) > 0)
except Exception as e:
    check("vercel.json es valido", False, str(e))

package_path = os.path.join(ROOT_DIR, "package.json")
try:
    with open(package_path, "r", encoding="utf-8") as f:
        p_json = json.load(f)
        check("package.json es JSON valido", True)
        check("package.json script start definido", "start" in p_json.get("scripts", {}))
except Exception as e:
    check("package.json es valido", False, str(e))

sw_path = os.path.join(ROOT_DIR, "sw.js")
check("sw.js existe", os.path.isfile(sw_path))
if os.path.isfile(sw_path):
    with open(sw_path, "r", encoding="utf-8") as f:
        sw_code = f.read()
        check("sw.js gestiona evento fetch", "addEventListener('fetch'" in sw_code or 'addEventListener("fetch"' in sw_code)
        check("sw.js gestiona evento install", "addEventListener('install'" in sw_code or 'addEventListener("install"' in sw_code)

# 4. Servidor Local y Endpoints REST API
print("\n[4] Levantando Servidor Node y Comprobando Endpoints API y Páginas...")
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
        check("GET /api/products catalogo completo 21 items", data.get("total") == 21)

    # Test /api/products?category=electricidad
    with urllib.request.urlopen(f"{BASE_URL}/api/products?category=electricidad") as resp:
        check("GET /api/products?category=electricidad responde HTTP 200", resp.status == 200)
        data = json.loads(resp.read().decode("utf-8"))
        check("GET /api/products?category=electricidad filtra 4 items", data.get("total") == 4)

    # Test /api/products?q=amoladora
    with urllib.request.urlopen(f"{BASE_URL}/api/products?q=amoladora") as resp:
        check("GET /api/products?q=amoladora responde HTTP 200", resp.status == 200)
        data = json.loads(resp.read().decode("utf-8"))
        check("GET /api/products?q=amoladora encuentra amoladora", data.get("total") >= 1)

    # Test POST /api/quote
    quote_payload = json.dumps({
        "cliente": "Prueba Automatizada",
        "telefono": "3584000000",
        "entrega": "local",
        "items": [
            { "nombre": "Taladro Percutor 650W", "cantidad": 2, "precio": 64900 },
            { "nombre": "Casco de Seguridad", "cantidad": 1, "precio": 8500 }
        ],
        "mensaje": "Prueba de suite automatizada"
    }).encode("utf-8")

    req_quote = urllib.request.Request(
        f"{BASE_URL}/api/quote",
        data=quote_payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_quote) as resp:
        check("POST /api/quote responde HTTP 200", resp.status == 200)
        q_data = json.loads(resp.read().decode("utf-8"))
        check("POST /api/quote genera cotizacionId COT-...", q_data.get("cotizacionId", "").startswith("COT-"))
        check("POST /api/quote calcula total correcto ($138.300)", q_data.get("total") == 138300)
        check("POST /api/quote genera whatsappUrl con destino 5493584238976", "5493584238976" in q_data.get("whatsappUrl", ""))

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
