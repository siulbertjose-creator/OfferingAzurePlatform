/**
 * Updates all 6 offerings with the latest proposal content via the REST API.
 * Supports dev and production — configure with API_BASE_URL env var.
 *
 * Usage:
 *   Dev:   pnpm --filter @workspace/scripts run update-offerings-api
 *   Prod:  API_BASE_URL=https://your-app.replit.app pnpm --filter @workspace/scripts run update-offerings-api
 */

const BASE = process.env.API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:80";

const OFFERINGS = [
  {
    name: "Journey to FinOps",
    techPillar: "IaC + Serverless",
    durationHours: "4 semanas",
    businessBenefit:
      "De la factura sorpresa al control financiero total: visibilidad 360° del gasto Azure, eliminación de recursos huérfanos y ~30% de reducción de desperdicio en los primeros 30 días.",
    whatIsIt:
      "Journey to FinOps transforma los datos de consumo Azure en inteligencia financiera accionable. Desplegado 100% mediante IaC (Terraform + Azure Functions en PowerShell 7.4), construye un pipeline automatizado que va desde Cost Management + Resource Graph hasta un Dashboard Power BI con Queries M parametrizadas: visibilidad histórica y proyectada, distribución de gasto por tipo de recurso, conteo de recursos huérfanos y recomendaciones de ahorro priorizadas — todo operativo en 4 semanas.",
    whatDoesItSolve:
      "Tres problemas críticos del cloud sin gobierno financiero: Gasto Ineficiente (recursos huérfanos y subutilizados sin responsable), Falta de Accountability (imposibilidad de asignar costos reales a unidades de negocio) y Decisiones Reactivas (facturas sorpresa sin proyecciones claras). ACIM da el mapa (Inventario y Gobernanza) — Journey to FinOps da el control financiero.",
  },
  {
    name: "Azure Cloud Infrastructure Management (ACIM)",
    techPillar: "ACIM",
    durationHours: "40 horas",
    businessBenefit:
      "Visibilidad 360°, gobernanza continua y cero fricción operativa sobre toda la infraestructura Azure.",
    whatIsIt:
      "ACIM es el programa de Readymind para la gestión integral de infraestructura Azure, compuesto por 3 módulos especializados: Azure Export Analyzer (extracción automatizada de inventario con identidad de solo lectura), Smart Cloud Auditor (auditoría cognitiva y análisis de riesgos alineado al Well-Architected Framework) y Discovery Maps (mapeo multidimensional de recursos, regiones y suscripciones). Opera con mínimo privilegio — rol Reader + Managed Identities + Azure Key Vault — sin impacto sobre los entornos productivos.",
    whatDoesItSolve:
      "Tres desafíos críticos de la infraestructura dinámica: (1) Obsolescencia inmediata — la documentación estática pierde validez en 24 horas; (2) Deuda técnica de diseño — justificaciones técnicas dispersas por decisiones operativas; (3) Carga operativa — exceso de tiempo dedicado a reportes de cumplimiento para stakeholders. ACIM automatiza todo el ciclo de descubrimiento, auditoría y mapeo, entregando visibilidad en tiempo real alineada con CAF, WAF, ASB y MCRA.",
  },
  {
    name: "Accelerator Azure Virtual Desktop (AVD)",
    techPillar: "VDI Escalable",
    durationHours: "8 semanas",
    businessBenefit:
      "Escritorios y aplicaciones corporativas en la nube con seguridad Zero Trust, auto-escalado y previsibilidad financiera total — en solo 8 semanas.",
    whatIsIt:
      "Accelerator AVD es el Journey estructurado de Readymind para desplegar Azure Virtual Desktop a escala empresarial. En 5 fases y 8 semanas, guiamos a la organización desde la definición estratégica hasta una plataforma productiva, resiliente y lista para escalar: con Infraestructura como Código (Terraform + PowerShell), Host Pools configurados, Golden Images automatizadas, perfiles FSLogix y entrega de aplicaciones gestionada. Todo alineado al Azure Well-Architected Framework.",
    whatDoesItSolve:
      "La adopción desordenada de entornos de escritorio remoto: infraestructura sobredimensionada sin auto-escalado, identidades sin gobierno Zero Trust, perfiles de usuario frágiles y costosos de administrar, sin visibilidad financiera del consumo real. El Accelerator AVD resuelve la movilidad, la seguridad y el costo de una sola vez — dejando al equipo IT capacitado para operar la plataforma de forma autónoma desde el Día 2.",
  },
  {
    name: "Accelerator Landing Zone Design Hub & Spoke",
    techPillar: "Hub & Spoke",
    durationHours: "6 semanas",
    businessBenefit:
      "El cimiento correcto para su adopción de Azure — una plataforma de red, identidad y gobierno lista para escalar desde el primer workload. Hub & Spoke desplegado 100% como IaC con Terraform en 6 semanas.",
    whatIsIt:
      "Accelerator Landing Zone Design Hub & Spoke entrega una plataforma Azure lista para producción, diseñada bajo el Cloud Adoption Framework de Microsoft y la topología Hub & Spoke. En 4 fases y 6 semanas: definimos los requisitos de red y gobierno, diseñamos la jerarquía de Management Groups y VNets Hub & Spoke (HLD/LLD), desplegamos toda la infraestructura como Código con Terraform — incluyendo Azure Firewall o NVA para inspección centralizada, NSG, UDR, peering, RBAC y Azure Policy — y validamos la plataforma con un workload real antes del handover.",
    whatDoesItSolve:
      "Una Landing Zone mal diseñada es el origen de la mayoría de los problemas en la nube: redes planas sin segmentación, identidades sin gobierno, políticas inconsistentes y costos difíciles de rastrear. El Accelerator evita la deuda técnica que acumula quien improvisa la red y el gobierno al ritmo de cada workload — entrega la plataforma correcta desde el día uno, lista para escalar, con todo el despliegue en Terraform: reproducible, versionable y auditable.",
  },
  {
    name: "Road to Cloud with Azure Migrate & CAF",
    techPillar: "Metodología CAF",
    durationHours: "8 semanas",
    businessBenefit:
      "Su camino estructurado hacia Azure — desde el inventario on-premises hasta la nube, con el ritmo y alcance que su organización necesita. Assessment, Landing Zone, migración modular (IaaS · AKS · PaaS · IA) y Go-Live en 8 semanas.",
    whatIsIt:
      "Road to Cloud with Azure Migrate & CAF guía a su organización desde el assessment de la infraestructura actual hasta la operación en Azure, alineada al Cloud Adoption Framework de Microsoft. En 4 fases y 8 semanas: descubrimos y clasificamos workloads con Azure Migrate siguiendo las 6R (Rehost, Replatform, Refactor, Rearchitect, Retire, Retain), desplegamos la Landing Zone con Management Groups, hub & spoke, RBAC y Azure Policy, ejecutamos la migración en tracks modulares (IaaS, AKS, PaaS, Analítica e IA) y entregamos el entorno en producción con runbooks y handover completo.",
    whatDoesItSolve:
      "La migración descontrolada sin estrategia: workloads movidos a la nube sin clasificación, sin Landing Zone preparada y sin business case que justifique la inversión. El resultado: deuda técnica en Azure, costos descontrolados y equipos sin capacidad de operar el nuevo entorno. Road to Cloud resuelve el orden: primero el destino (Landing Zone), luego la migración modular con validación en cada paso — sin big bang, con rollback posible y coexistencia on-premises controlada durante todo el proceso.",
  },
  {
    name: "Infraestructura Híbrida con Azure Arc",
    techPillar: "Gobernanza Híbrida",
    durationHours: "6 semanas",
    businessBenefit:
      "Gestione toda su infraestructura on-premises y multicloud desde un único panel en Azure — sin mover una sola carga de trabajo. Visibilidad centralizada, gobierno por políticas y patching automatizado en 6 semanas.",
    whatIsIt:
      "Accelerator Infraestructura Híbrida con Azure Arc extiende el portal de Azure a servidores on-premises, VMs en otras nubes y clusters Kubernetes, tratándolos como recursos nativos de Azure. En 4 fases y 6 semanas, desplegamos el agente Arc Connected Machine mediante scripts PowerShell automatizados y GPO, configuramos Resource Groups con tagging definido, activamos Azure Update Manager con ventanas de mantenimiento, aplicamos Azure Policy para enforced compliance y habilitamos Extended Security Updates (ESU) para sistemas fuera de soporte.",
    whatDoesItSolve:
      "La infraestructura heterogénea sin gobierno unificado: servidores on-premises y multicloud invisibles desde Azure, patching manual servidor a servidor sin trazabilidad, configuraciones críticas sin compliance enforced y sistemas fuera de soporte sin ESU. Azure Arc no requiere migrar cargas de trabajo — la infraestructura permanece donde está y se gestiona desde Azure de forma no intrusiva, con automatización desde el primer día.",
  },
];

async function login(): Promise<string> {
  const res = await fetch(`${BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "acim2024" }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("No token in login response");
  return data.token;
}

async function listOfferings(token: string): Promise<Array<{ id: number; name: string }>> {
  const res = await fetch(`${BASE}/api/offerings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`List offerings failed: ${res.status}`);
  const data = (await res.json()) as { offerings: Array<{ id: number; name: string }> };
  return data.offerings;
}

async function updateOffering(
  token: string,
  id: number,
  payload: (typeof OFFERINGS)[0],
): Promise<void> {
  const res = await fetch(`${BASE}/api/offerings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Update offering ${id} failed: ${res.status} ${await res.text()}`);
}

async function run() {
  console.log(`\n🔗 Target: ${BASE}\n`);

  const token = await login();
  console.log("✅ Logged in as admin\n");

  const existing = await listOfferings(token);
  console.log(`📋 Found ${existing.length} offerings in DB\n`);

  for (const payload of OFFERINGS) {
    const match = existing.find(o => o.name === payload.name);
    if (!match) {
      console.warn(`⚠️  No match found for "${payload.name}" — skipping`);
      continue;
    }
    await updateOffering(token, match.id, payload);
    console.log(`✅ Updated [${match.id}] ${payload.name}`);
  }

  console.log("\n🎉 All offerings updated successfully!\n");
}

run().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
