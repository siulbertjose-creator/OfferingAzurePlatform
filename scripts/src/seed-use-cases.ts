import { db, useCasesTable, offeringsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function seed() {
  // Get current offering IDs by name
  const offerings = await db.select().from(offeringsTable);
  const byName = (name: string) => offerings.find(o => o.name.includes(name))?.id;

  const finopsId     = byName("FinOps");
  const acimId       = byName("ACIM");
  const avdId        = byName("Virtual Desktop");
  const hubSpokeId   = byName("Hub & Spoke");
  const cafId        = byName("Azure Migrate");
  const arcId        = byName("Azure Arc");

  console.log("Offering IDs:", { finopsId, acimId, avdId, hubSpokeId, cafId, arcId });

  // Delete all existing use cases and re-seed cleanly
  await db.delete(useCasesTable);
  console.log("Cleared existing use cases");

  const cases = [
    // ─── Journey to FinOps (1) ───────────────────────────────────────────────
    {
      offeringId: finopsId!,
      projectName: "Control de Costos para Grupo Industrial Multinacional",
      industryType: "Manufactura",
      description:
        "Implementación del framework FinOps sobre un Tenant con 14 suscripciones Azure y gasto mensual de $220k USD. Despliegue 100% IaC con Bicep y Azure Functions para descubrimiento automático de recursos.",
      previousState:
        "Factura mensual de $220k sin visibilidad por equipo ni proyecto. CFO recibía una sola línea de factura Azure. Tres equipos de planta con recursos huérfanos activos desde hace 8 meses sin que nadie lo supiera.",
      newState:
        "Dashboard FinOps en Power BI con granularidad por suscripción, equipo y entorno. Ahorro del 31% en 60 días: right-sizing de 47 VMs, eliminación de 12 discos huérfanos y 3 gateways sin uso. Chargeback automático por departamento.",
      companyIconUrl: null,
    },
    {
      offeringId: finopsId!,
      projectName: "Optimización de Costos en Startup SaaS B2B",
      industryType: "Tecnología",
      description:
        "Startup con crecimiento acelerado que perdió el control de su gasto Azure. Implementación de políticas de apagado automático, spot instances y budget alerts por entorno.",
      previousState:
        "Entornos de desarrollo y staging corriendo 24/7 igual que producción. Sin políticas de retención de logs ni lifecycle de storage. Gasto creciendo 18% mensual sin correlación con el negocio.",
      newState:
        "Entornos no-productivos apagados fuera de horario laboral (ahorro 67% en dev/staging). Políticas de lifecycle en todos los Storage Accounts. Budget alerts automáticos al 80% y 100%. Gasto estabilizado con crecimiento alineado al revenue.",
      companyIconUrl: null,
    },
    {
      offeringId: finopsId!,
      projectName: "FinOps Governance para Holding Financiero Regional",
      industryType: "Servicios Financieros",
      description:
        "Modelo de gobierno financiero para holding con 6 empresas subsidiarias en Azure, unificando la visibilidad de costos y estableciendo accountability por BU.",
      previousState:
        "6 subsidiarias con acceso independiente a sus suscripciones sin gobierno central. Sin tagging obligatorio. Duplicación de servicios (AD, DNS, monitoring) en cada subsidiaria por desconocimiento de recursos compartidos.",
      newState:
        "Management Group con políticas de tagging obligatorio en todas las subsidiarias. Hub compartido con servicios centralizados reduce el gasto estructural un 22%. FinOps Council mensual con reportes por BU. Recuperación de costos cruzados automatizada.",
      companyIconUrl: null,
    },

    // ─── ACIM (2) ────────────────────────────────────────────────────────────
    {
      offeringId: acimId!,
      projectName: "Gobierno de Plataforma para Banco Retail Nacional",
      industryType: "Servicios Financieros",
      description:
        "Implementación de ACIM con Azure Auditor y SCA para banco con 280 recursos en Azure. Mapeo cognitivo completo del Tenant y remediación de hallazgos críticos de seguridad.",
      previousState:
        "Plataforma Azure sin línea base de seguridad. 47 hallazgos críticos en Defender for Cloud sin remediar. Sin visibilidad de la topología de red ni relaciones entre recursos. Infraestructura documentada manualmente en Excel desactualizado.",
      newState:
        "Azure Auditor ejecutándose semanalmente con reporte automático al CISO. Discovery Map actualizado en tiempo real. Secure Score mejorado de 42% a 81% en 8 semanas. Zero hallazgos críticos pendientes. Cumplimiento PCI-DSS documentado y auditable.",
      companyIconUrl: null,
    },
    {
      offeringId: acimId!,
      projectName: "Modernización de Core Bancario con Microservicios",
      industryType: "Servicios Financieros",
      description:
        "Gestión continua de infraestructura AKS multi-cluster con ACIM. Visibilidad cognitiva de 340 pods, 18 namespaces y dependencias entre microservicios del core bancario.",
      previousState:
        "Cluster AKS sin monitoreo granular de dependencias. Incidentes de producción con MTTR de 6+ horas por falta de visibilidad. Deuda técnica acumulada en configuraciones de red sin documentar.",
      newState:
        "Discovery Maps de AKS con trazabilidad de cada microservicio. MTTR reducido a 38 minutos promedio. Alertas proactivas antes de que los problemas lleguen a producción. Arquitectura documentada automáticamente en cada release.",
      companyIconUrl: null,
    },
    {
      offeringId: acimId!,
      projectName: "Well-Architected Review para Empresa de Logística",
      industryType: "Manufactura",
      description:
        "Evaluación y remediación continua con Azure Auditor alineada a los 5 pilares del Well-Architected Framework para plataforma de gestión de flotas con 120 recursos Azure.",
      previousState:
        "Plataforma construida sin revisión de arquitectura formal. Alta deuda técnica: sin zonas de disponibilidad, sin backup validado, sin cifrado en repos de datos históricos de rutas.",
      newState:
        "WAF score mejorado de 38 a 76 puntos en 12 semanas. Arquitectura multi-zona con disponibilidad 99.95%. Backups validados semanalmente de forma automática. Cifrado at-rest y in-transit en todos los datastores.",
      companyIconUrl: null,
    },

    // ─── AVD (3) ─────────────────────────────────────────────────────────────
    {
      offeringId: avdId!,
      projectName: "Escritorios Virtuales para Fuerza Laboral Remota",
      industryType: "Retail",
      description:
        "Despliegue de Azure Virtual Desktop para 800 usuarios remotos de cadena retail, sustituyendo VPN tradicional y equipos físicos de alto costo.",
      previousState:
        "800 laptops corporativas con ciclo de renovación de $1.2M cada 3 años. VPN inestable con latencias >200ms. Helpdesk saturado con incidencias de conectividad. Acceso a sistemas core bloqueado fuera de la red corporativa.",
      newState:
        "AVD multisesión con Windows 11 Enterprise. BYOD habilitado desde cualquier dispositivo. Costo reducido 65% vs modelo anterior. Latencia <30ms con proximity placement groups. Helpdesk de conectividad reducido en un 80%.",
      companyIconUrl: null,
    },
    {
      offeringId: avdId!,
      projectName: "Virtualización de Escritorios para Despacho Legal Internacional",
      industryType: "Servicios Financieros",
      description:
        "Migración de 200 abogados en 3 países a AVD con acceso seguro a documentos confidenciales, cumplimiento GDPR y control de acceso por país.",
      previousState:
        "Abogados en Europa y LATAM accediendo a expedientes en servidor on-premise en Madrid vía VPN. Latencia de 400ms+ para usuarios en México. Sin control granular de qué documentos puede ver cada usuario por jurisdicción.",
      newState:
        "AVD con host pools regionalizados en West Europe y East US. Latencia promedio <40ms en todas las sedes. Conditional Access con restricciones por país y rol. Compliance GDPR documentado para reguladores europeos.",
      companyIconUrl: null,
    },
    {
      offeringId: avdId!,
      projectName: "Plataforma CAD/BIM en la Nube para Constructora",
      industryType: "Manufactura",
      description:
        "AVD con GPU (NV-series) para equipos de arquitectura e ingeniería que necesitan correr AutoCAD, Revit y Civil 3D sin workstations de alto costo locales.",
      previousState:
        "Workstations físicas de $8,000 USD por puesto con ciclo de vida de 3 años. Ingenieros no podían trabajar desde casa en proyectos BIM por falta de GPU local. Licencias de software inactivas en equipos sin uso.",
      newState:
        "AVD GPU (NV6ads) disponible bajo demanda. Costo por hora activa vs pago fijo mensual: ahorro del 55% en puestos de diseño. 100% del equipo accede a Revit y AutoCAD desde cualquier dispositivo. Licencias pooled compartidas entre turnos.",
      companyIconUrl: null,
    },

    // ─── Hub & Spoke (4) ─────────────────────────────────────────────────────
    {
      offeringId: hubSpokeId!,
      projectName: "Landing Zone Corporativa para Grupo Empresarial con 8 Subsidiarias",
      industryType: "Servicios Financieros",
      description:
        "Diseño e implementación de arquitectura Hub & Spoke para centralizar conectividad, seguridad y DNS de holding con 8 empresas en Azure, eliminando la proliferación de VNets no gobernadas.",
      previousState:
        "8 subsidiarias con VNets independientes sin peering estructurado. 4 Azure Firewalls redundantes (uno por subsidiaria) sin política central. DNS local por empresa sin resolución privada cross-suscripción. Costo de red: $18k/mes.",
      newState:
        "Hub único con Azure Firewall Premium centralizado. Spoke por subsidiaria con políticas heredadas del Hub. Private DNS Zones centralizadas con resolución automática. Costo de red reducido a $7.2k/mes (-60%). Tiempo de provisión de nueva subsidiaria: 2 horas vs 3 semanas.",
      companyIconUrl: null,
    },
    {
      offeringId: hubSpokeId!,
      projectName: "Red Segura para Retailer con 200 Tiendas",
      industryType: "Retail",
      description:
        "Arquitectura Hub & Spoke con Azure Virtual WAN para conectar 200 puntos de venta con la plataforma de e-commerce y ERP en Azure, reemplazando MPLS tradicional.",
      previousState:
        "200 tiendas conectadas vía MPLS a datacenter central: costo $45k/mes, SLA de 72h para nuevas conexiones. Toda la navegación de tienda salía por el DC central añadiendo latencia innecesaria. Sin visibilidad de tráfico por tienda.",
      newState:
        "Azure Virtual WAN con hubs regionales en 3 países. Internet breakout local en tienda con filtrado Firewall. Costo de conectividad reducido a $12k/mes (-73%). Nueva tienda conectada en 4 horas. Dashboards de tráfico por ubicación en tiempo real.",
      companyIconUrl: null,
    },
    {
      offeringId: hubSpokeId!,
      projectName: "Conectividad Híbrida para Empresa Farmacéutica",
      industryType: "Salud",
      description:
        "Diseño de Landing Zone con ExpressRoute y VPN activo-pasivo para empresa farmacéutica con regulación FDA y EMA, conectando 3 laboratorios on-premise con Azure.",
      previousState:
        "Laboratorios conectados con VPN site-to-site básica sin redundancia. Corte de conectividad de 4h el año anterior por fallo de gateway. Sin microsegmentación entre sistemas GxP y sistemas de negocio general.",
      newState:
        "ExpressRoute 1Gbps con VPN como failover automático (<30 segundos). Uptime de conectividad: 99.99% en 12 meses post-implementación. Microsegmentación GxP con NSGs y Azure Firewall validada por auditor externo FDA.",
      companyIconUrl: null,
    },

    // ─── CAF / Azure Migrate (5) ──────────────────────────────────────────────
    {
      offeringId: cafId!,
      projectName: "Migración de Datacenter On-Premise para Aseguradora",
      industryType: "Servicios Financieros",
      description:
        "Migración de 180 servidores on-premise a Azure siguiendo el Cloud Adoption Framework. Discovery con Azure Migrate, right-sizing y migración en 3 waves sin interrupción de servicios regulados.",
      previousState:
        "Datacenter propio con contrato de colocation vencido en 6 meses. 180 servidores físicos con 40% de utilización promedio. Sin documentación de dependencias entre aplicaciones. Presión regulatoria para salir del datacenter antes del vencimiento.",
      newState:
        "180 servidores migrados en 14 semanas (3 waves). Zero downtime en aplicaciones core. Right-sizing redujo el costo de cómputo un 38% vs lift & shift puro. Datacenter cerrado 3 semanas antes del deadline. Regulador notificado con documentación completa de la migración.",
      companyIconUrl: null,
    },
    {
      offeringId: cafId!,
      projectName: "Modernización de ERP SAP a Azure",
      industryType: "Manufactura",
      description:
        "Migración y optimización de SAP S/4HANA desde infraestructura on-premise a Azure con certificación SAP, aprovechando instancias M-series de alto rendimiento.",
      previousState:
        "SAP HANA en servidores físicos propios con 6 años de antigüedad. Ventanas de mantenimiento de 8 horas cada trimestre. Performance degradada en cierres de mes con >2,000 usuarios concurrentes. Sin DR documentado.",
      newState:
        "SAP S/4HANA en Azure M64ls con certificación SAP oficial. Tiempo de cierre de mes reducido 65%. DR en Azure con RPO <15 min y RTO <1 hora. Ventanas de mantenimiento eliminadas gracias a Azure Site Recovery. Soporte SAP RISE contemplado para siguiente fase.",
      companyIconUrl: null,
    },
    {
      offeringId: cafId!,
      projectName: "Cloud Migration para Cadena Hotelera Latinoamericana",
      industryType: "Retail",
      description:
        "Migración de 12 aplicaciones críticas (PMS, CRM, Revenue Management) de 3 hoteles a Azure, con estrategia rehost + refactor según criticidad de cada sistema.",
      previousState:
        "12 aplicaciones en 2 servidores físicos compartidos sin aislamiento. Sin SLA formal para ningún sistema. Caída de PMS durante temporada alta en el año anterior costó $180k en compensaciones. Sin backup probado desde hace 14 meses.",
      newState:
        "PMS y sistemas críticos en IaaS aislado con SLA 99.9%. Sistemas secundarios refactorizados a App Service reduciendo costo un 42%. Backup automático validado semanalmente. Plan de DR probado con RTO <2 horas. Cero incidentes de disponibilidad en primera temporada post-migración.",
      companyIconUrl: null,
    },

    // ─── Azure Arc (6) ───────────────────────────────────────────────────────
    {
      offeringId: arcId!,
      projectName: "Gobierno Unificado de Infraestructura Híbrida Industrial",
      industryType: "Manufactura",
      description:
        "Extensión del plano de control Azure a 80 servidores on-premise en 4 plantas industriales usando Azure Arc, unificando la gestión de parches, compliance y monitoring desde un único panel.",
      previousState:
        "80 servidores on-premise en 4 plantas con gestión manual por planta. Inventario de servidores desactualizado en hojas de cálculo. Parches aplicados de forma inconsistente: algunos servidores con 18 meses sin actualizar. Sin visibilidad centralizada de vulnerabilidades.",
      newState:
        "80 servidores Arc-enabled con inventario en tiempo real en Azure Resource Graph. Update Manager con políticas de patching automático por grupo de riesgo. Defender for Servers activo en todos los nodos. Vulnerabilidades críticas: de 234 a 0 en 6 semanas. Audit log unificado para ISO 27001.",
      companyIconUrl: null,
    },
    {
      offeringId: arcId!,
      projectName: "Gestión Multicloud con Azure Arc para Empresa de Medios",
      industryType: "Tecnología",
      description:
        "Empresa de medios con cargas en Azure y AWS unifica governance, política y monitoring usando Azure Arc para los recursos AWS, eliminando herramientas de terceros costosas.",
      previousState:
        "Equipos distintos gestionando Azure y AWS con herramientas separadas (Datadog para AWS, Azure Monitor para Azure). $8k/mes en herramientas de observabilidad de terceros. Políticas de compliance duplicadas y a menudo inconsistentes entre clouds.",
      newState:
        "Servidores AWS Arc-enabled gestionados desde Azure Policy y monitoreados con Azure Monitor. Herramientas de terceros eliminadas: ahorro $8k/mes. Una sola consola de compliance para ambos clouds. RBAC unificado: mismo rol Azure funciona en recursos AWS a través de Arc.",
      companyIconUrl: null,
    },
    {
      offeringId: arcId!,
      projectName: "Kubernetes en el Edge para Cadena de Supermercados",
      industryType: "Retail",
      description:
        "Gestión centralizada de clústeres K3s en 150 tiendas usando Azure Arc for Kubernetes, con despliegue de aplicaciones de caja y stock mediante GitOps desde Azure.",
      previousState:
        "150 tiendas con mini-servidores locales gestionados de forma independiente. Actualización de software en tienda requería visita física o acceso remoto VPN manual. Sin visibilidad del estado de los sistemas en tienda desde central. Un fallo en tienda tardaba en promedio 4h en ser detectado.",
      newState:
        "150 clústeres K3s Arc-enabled con GitOps (Flux) desde repositorio central en Azure. Despliegue de nueva versión de app de caja en las 150 tiendas: 22 minutos. Alertas de fallo en tienda en <2 minutos via Azure Monitor. Gestión centralizada sin visitas físicas para actualizaciones de software.",
      companyIconUrl: null,
    },
  ];

  const inserted = await db.insert(useCasesTable).values(cases).returning();
  console.log(`✅ Inserted ${inserted.length} use cases across all 6 offerings`);

  // Summary
  const counts: Record<number, number> = {};
  inserted.forEach(u => {
    counts[u.offeringId] = (counts[u.offeringId] || 0) + 1;
  });

  const offeringNames = await db.select().from(offeringsTable);
  offeringNames.forEach(o => {
    console.log(`  ${o.name}: ${counts[o.id] || 0} use cases`);
  });

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
