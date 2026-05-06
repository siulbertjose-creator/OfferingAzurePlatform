import { db, useCasesTable, offeringsTable } from "@workspace/db";

async function seed() {
  const offerings = await db.select().from(offeringsTable);
  const id = (keyword: string) => offerings.find(o => o.name.includes(keyword))?.id!;

  const acimId     = id("ACIM");
  const cafId      = id("Migrate");
  const hubId      = id("Hub");
  const avdId      = id("Virtual Desktop");
  const arcId      = id("Arc");
  const finopsId   = id("FinOps");

  console.log("Offering IDs:", { acimId, cafId, hubId, avdId, arcId, finopsId });

  await db.delete(useCasesTable);
  console.log("Cleared existing use cases");

  const cases = [
    // ─── ACIM ─────────────────────────────────────────────────────────────────
    {
      offeringId: acimId,
      projectName: "Auditoría Azure - ACIM · Seguros Confianza",
      industryType: "Seguros",
      description: "Auditoría completa de infraestructura Azure y evaluación de cumplimiento normativo para aseguradora líder en Colombia. Uso de Azure Auditor y SCA para mapeo cognitivo del tenant.",
      previousState: "Sin visibilidad centralizada de los recursos Azure. Múltiples hallazgos de seguridad sin remediar en Defender for Cloud. Documentación de infraestructura desactualizada. Sin evidencias auditables para regulador (SFC).",
      newState: "Discovery Map completo del tenant en tiempo real. Secure Score mejorado significativamente. Hallazgos críticos remediados en 6 semanas. Evidencias de cumplimiento generadas automáticamente para auditorías regulatorias.",
      companyIconUrl: null,
    },
    {
      offeringId: acimId,
      projectName: "Auditoría Azure - ACIM · EMIN",
      industryType: "Industria / Manufactura",
      description: "Gestión continua de infraestructura Azure para empresa constructora y gerenciadora de desarrollo inmobiliario, con foco en gobierno de recursos y visibilidad del parque tecnológico.",
      previousState: "Infraestructura Azure creciendo sin gobierno formal. Sin inventario actualizado de recursos. Equipos de TI sin visibilidad de dependencias entre sistemas. Deuda técnica acumulada en configuraciones de red.",
      newState: "Azure Auditor ejecutándose semanalmente. Inventario de recursos actualizado en tiempo real con Azure Resource Graph. Dependencias documentadas mediante Discovery Maps. Plan de remediación de deuda técnica priorizado y ejecutado.",
      companyIconUrl: null,
    },
    {
      offeringId: acimId,
      projectName: "Auditoría Azure - ACIM · Aenza",
      industryType: "Construcción e Ingeniería",
      description: "Implementación de ACIM para empresa de construcción e ingeniería, incluyendo revisión de Well-Architected Framework y mejora del posture de seguridad en Azure.",
      previousState: "Plataforma Azure sin revisión de arquitectura formal. Recursos desplegados ad-hoc sin naming convention ni políticas de tagging. Sin monitoreo proactivo de disponibilidad ni costos.",
      newState: "Baseline de arquitectura documentada con Azure Auditor. Políticas de tagging y naming enforced mediante Azure Policy. Monitoreo proactivo con alertas configuradas. Reducción de incidentes no detectados en un 70%.",
      companyIconUrl: null,
    },
    {
      offeringId: acimId,
      projectName: "Auditoría Azure - ACIM · Auteco",
      industryType: "Manufactura Automotriz",
      description: "Auditoría y gestión de infraestructura Azure para fabricante y ensambladora de recursos automovilísticos, con foco en continuidad operativa y seguridad de sistemas de producción.",
      previousState: "Sistemas de manufactura conectados a Azure sin controles de seguridad formales. Sin separación entre redes OT y IT en la nube. Accesos privilegiados sin control ni auditoría.",
      newState: "Segmentación de red OT/IT implementada. Privileged Identity Management habilitado. Azure Auditor con políticas de cumplimiento específicas para manufactura. Cero accesos permanentes de alto privilegio.",
      companyIconUrl: null,
    },
    {
      offeringId: acimId,
      projectName: "Auditoría Azure - ACIM · GeoPark",
      industryType: "Extracción de Petróleo y Gas",
      description: "Gobierno y auditoría de plataforma Azure para empresa de exploración y producción de hidrocarburos, con requerimientos regulatorios de múltiples países de operación.",
      previousState: "Operaciones en múltiples países (Colombia, Chile, Brasil) con suscripciones Azure no gobernadas de forma unificada. Sin política de cumplimiento cross-country. Datos sensibles sin clasificación ni protección formal.",
      newState: "Management Group unificado con políticas de compliance por país. Clasificación de datos sensibles implementada con Microsoft Purview. Reporte de posture de seguridad unificado para el CISO regional. Auditoría regulatoria aprobada sin observaciones.",
      companyIconUrl: null,
    },
    {
      offeringId: acimId,
      projectName: "Auditoría Azure - ACIM · Ramo",
      industryType: "Alimentos",
      description: "Implementación de ACIM para compañía de alimentos líder, con foco en disponibilidad de sistemas de distribución y cumplimiento de estándares de seguridad alimentaria en la nube.",
      previousState: "Plataforma Azure sin SLA formal por sistema. Sistemas de gestión de cadena de suministro con accesos sin MFA. Sin backups validados de bases de datos de inventario y producción.",
      newState: "SLA por sistema documentado y monitoreado. MFA enforced en todos los accesos. Backups automatizados y validados semanalmente. Uptime de sistemas críticos de distribución: 99.9% en los últimos 6 meses.",
      companyIconUrl: null,
    },

    // ─── CAF / Azure Migrate ──────────────────────────────────────────────────
    {
      offeringId: cafId,
      projectName: "Azure Migrate Assessment · Corporación Interactuar",
      industryType: "Corporación de Desarrollo Social",
      description: "Assessment y plan de migración a Azure para corporación de desarrollo social, evaluando el parque tecnológico on-premise y definiendo la hoja de ruta hacia la nube con enfoque en optimización de costos.",
      previousState: "Infraestructura on-premise de más de 8 años con alta tasa de fallo. Sin capacidad para escalar en temporadas de alta demanda de servicios sociales. Costos de mantenimiento crecientes sin presupuesto para renovación.",
      newState: "Assessment completo con 120 servidores inventariados y clasificados por estrategia de migración. TCO proyectado con ahorro del 35% vs mantenimiento on-premise. Hoja de ruta de migración en 3 fases aprobada por dirección.",
      companyIconUrl: null,
    },
    {
      offeringId: cafId,
      projectName: "Azure Migrate Assessment · Grupo Las Marías",
      industryType: "Alimentación / Bebidas",
      description: "Assessment de migración para grupo alimenticio con operaciones en múltiples países, evaluando cargas de trabajo de ERP, CRM y sistemas de gestión de cadena de frío.",
      previousState: "ERP y sistemas de trazabilidad alojados en datacenter propio con contrato de colocation próximo a vencer. Sin DR formal. Dependencia de proveedor local de datacenter sin SLA garantizado.",
      newState: "Assessment de 85 cargas de trabajo completado. Estrategia lift & shift para sistemas críticos y refactor para aplicaciones legacy. DR en Azure con RTO <2 horas definido. Plan de salida del datacenter en 6 meses.",
      companyIconUrl: null,
    },
    {
      offeringId: cafId,
      projectName: "Azure Migrate Assessment · Autopista del Sol",
      industryType: "Infraestructura / Concesiones Viales",
      description: "Evaluación de migración a Azure para empresa concesionaria de autopistas, con foco en sistemas de gestión de peajes, monitoreo de tráfico y cumplimiento regulatorio de concesión.",
      previousState: "Sistemas de peaje y CCTV en infraestructura on-premise sin redundancia geográfica. Regulador requiere plan de continuidad de negocio documentado y probado. Sin capacidad de procesamiento en tiempo real para análisis de tráfico.",
      newState: "Assessment de infraestructura crítica completado con análisis de riesgo regulatorio. Arquitectura de referencia en Azure con alta disponibilidad multi-zona propuesta. Plan de BCP documentado según requerimientos del regulador de concesiones.",
      companyIconUrl: null,
    },
    {
      offeringId: cafId,
      projectName: "Modernización de Infraestructura · On Vacation",
      industryType: "Agencia de Turismo",
      description: "Modernización de plataforma tecnológica para agencia de turismo, migrando sistemas de reservas y gestión de paquetes a Azure con mejora de rendimiento y disponibilidad.",
      previousState: "Plataforma de reservas con caídas frecuentes en temporada alta. Infraestructura sin capacidad de escalar elásticamente. Pérdida de ventas en temporadas peak por indisponibilidad del sistema.",
      newState: "Plataforma migrada a Azure App Service con autoescalado. Disponibilidad 99.9% durante temporada alta. Tiempo de respuesta de reservas mejorado un 60%. Capacidad de escalar en minutos ante picos de demanda.",
      companyIconUrl: null,
    },
    {
      offeringId: cafId,
      projectName: "Azure Migrate Assessment · Permoda",
      industryType: "Distribución de Indumentaria",
      description: "Assessment de migración para distribuidor de indumentaria con red de tiendas físicas y canal e-commerce, evaluando sistemas de inventario, POS y plataforma digital.",
      previousState: "Sistema de inventario en servidor on-premise sin sincronización en tiempo real con tiendas. E-commerce en hosting compartido con performance degradada en temporadas de descuento. Sin DR formal.",
      newState: "Assessment de 60 cargas de trabajo completado. Roadmap de migración priorizando e-commerce y sistema de inventario. Arquitectura cloud-native propuesta para e-commerce con autoscaling. Reducción proyectada del 40% en costos de infraestructura.",
      companyIconUrl: null,
    },
    {
      offeringId: cafId,
      projectName: "Azure Migrate Assessment · Chile Atiende & IPS",
      industryType: "Instituto de Previsión Social",
      description: "Evaluación de migración a Azure para plataforma de atención ciudadana del Instituto de Previsión Social de Chile, con requerimientos de disponibilidad y cumplimiento del sector público.",
      previousState: "Plataforma de atención ciudadana con alta demanda y recursos limitados on-premise. Caídas del sistema en períodos de pago de pensiones afectando a miles de ciudadanos. Sin cumplimiento formal de estándares de seguridad del Estado chileno.",
      newState: "Assessment completado bajo marco de cumplimiento del Estado chileno. Arquitectura propuesta con alta disponibilidad y escalado automático para períodos pico. Plan de migración en fases que no interrumpe la atención ciudadana.",
      companyIconUrl: null,
    },
    {
      offeringId: cafId,
      projectName: "Azure Migrate Assessment · Loma Negra",
      industryType: "Materiales de Construcción",
      description: "Assessment de migración para productor y distribuidor de cemento y materiales de construcción, evaluando sistemas industriales, ERP y plataforma de logística.",
      previousState: "Infraestructura IT distribuida en múltiples plantas sin gobierno centralizado. ERP SAP en hardware propio con alta deuda técnica. Sistemas de pesaje y despacho en plantas sin conectividad confiable a sistemas centrales.",
      newState: "Inventario completo de 200+ activos en plantas y oficinas. Estrategia de migración SAP a Azure con instancias certificadas. Plan de conectividad híbrida para plantas con Azure Stack Edge propuesto.",
      companyIconUrl: null,
    },
    {
      offeringId: cafId,
      projectName: "Azure Migrate Assessment · Socorro Médico Vittal",
      industryType: "Emergencias Médicas",
      description: "Evaluación de migración a Azure para empresa de emergencias médicas, con foco en disponibilidad crítica de sistemas de despacho, geolocalización de ambulancias y registros clínicos.",
      previousState: "Sistema de despacho de ambulancias en infraestructura on-premise sin redundancia. Un corte de energía histórico afectó la operación durante 3 horas. Registros clínicos en sistemas locales sin backup verificado.",
      newState: "Arquitectura de alta disponibilidad en Azure propuesta con DR en segunda región. Sistema de despacho con redundancia activo-activo. Plan de migración sin downtime de sistemas críticos. Cumplimiento HIPAA-equivalente para registros clínicos documentado.",
      companyIconUrl: null,
    },
    {
      offeringId: cafId,
      projectName: "Azure Migrate Assessment · Consorcio Express",
      industryType: "Transporte de Pasajeros",
      description: "Assessment de migración para empresa de transporte de pasajeros, evaluando sistemas de venta de tickets, gestión de flota y plataforma de atención al cliente.",
      previousState: "Sistema de venta de tickets en servidores físicos propios con alta tasa de fallos en hora pico. Sin visibilidad en tiempo real del estado de la flota. Plataforma de atención al cliente no disponible fuera de horario de oficina.",
      newState: "Assessment de infraestructura completado con priorización por criticidad operativa. Roadmap de migración en 4 meses. Arquitectura cloud propuesta con disponibilidad 99.9% para sistemas de venta y chatbot de atención 24/7.",
      companyIconUrl: null,
    },

    // ─── Hub & Spoke ─────────────────────────────────────────────────────────
    {
      offeringId: hubId,
      projectName: "Migración Cross-Subscription · FV",
      industryType: "Industria / Manufactura",
      description: "Migración de recursos entre suscripciones Azure con diseño de Landing Zone Hub & Spoke para empresa industrial de manufactura, centralizando gobierno y conectividad.",
      previousState: "Recursos Azure dispersos en múltiples suscripciones sin estructura formal. Conectividad entre suscripciones mediante workarounds manuales. Sin política de acceso unificada entre entornos de producción y desarrollo.",
      newState: "Landing Zone Hub & Spoke implementada con topología clara. Migración cross-subscription sin downtime completada. RBAC unificado con grupos de Azure AD. Conectividad centralizada mediante VNet peering gobernado.",
      companyIconUrl: null,
    },
    {
      offeringId: hubId,
      projectName: "Azure Files Landing Zone · Corporación Interactuar",
      industryType: "Corporación de Desarrollo Social",
      description: "Diseño e implementación de Landing Zone con Azure Files para corporación de desarrollo social, reemplazando servidores de archivos on-premise con solución nativa de nube.",
      previousState: "Servidores de archivos on-premise con capacidad limitada y sin redundancia. Acceso remoto a archivos mediante VPN inestable. Sin política de retención ni clasificación de documentos.",
      newState: "Azure Files implementado con sincronización mediante Azure File Sync. Acceso remoto sin VPN con autenticación AD. Políticas de retención y lifecycle configuradas. Costo de almacenamiento reducido un 45% vs servidores físicos.",
      companyIconUrl: null,
    },
    {
      offeringId: hubId,
      projectName: "Resource Migration Cross-Subscription · F.V.S.A",
      industryType: "Grifería de Alta Tecnología",
      description: "Migración de recursos entre suscripciones y reestructuración de Landing Zone para empresa fabricante de grifería de alta tecnología con operaciones en múltiples países.",
      previousState: "Recursos Azure en suscripción legacy con deuda técnica de arquitectura. Sin separación formal entre ambientes. Nombres de recursos sin convención. Costos no identificables por unidad de negocio.",
      newState: "Arquitectura Hub & Spoke con spokes por ambiente y país. Migración de recursos completada sin downtime. Naming convention y tagging obligatorio implementado. Chargeback por unidad de negocio habilitado.",
      companyIconUrl: null,
    },
    {
      offeringId: hubId,
      projectName: "Resource Migration Cross-Tenant · RICOH",
      industryType: "Tecnología",
      description: "Migración de recursos entre tenants de Azure para filial de RICOH, consolidando la infraestructura cloud bajo el tenant corporativo global con preservación de configuraciones.",
      previousState: "Filial local con tenant Azure independiente no alineado al estándar corporativo global. Duplicación de licencias y servicios. Sin visibilidad desde el tenant global. Imposibilidad de aprovechar contratos enterprise de la casa matriz.",
      newState: "Migración cross-tenant completada preservando datos y configuraciones. Incorporación al tenant corporativo global. Reducción de costos aprovechando licencias enterprise. Visibilidad unificada desde el gobierno corporativo.",
      companyIconUrl: null,
    },
    {
      offeringId: hubId,
      projectName: "Azure Landing Zone · Diners",
      industryType: "Servicios Financieros",
      description: "Diseño e implementación de Landing Zone enterprise para compañía de tarjetas de crédito, débito y prepago, con foco en seguridad financiera y cumplimiento PCI-DSS.",
      previousState: "Infraestructura Azure sin arquitectura formal de Landing Zone. Sistemas de procesamiento de tarjetas sin segmentación adecuada. Sin cumplimiento documentado de PCI-DSS en la nube. Accesos de alto privilegio sin control.",
      newState: "Landing Zone diseñada bajo estándares PCI-DSS con microsegmentación de red. Azure Firewall Premium para inspección de tráfico financiero. PIM implementado para accesos privilegiados. Auditoría PCI-DSS en la nube aprobada sin observaciones críticas.",
      companyIconUrl: null,
    },
    {
      offeringId: hubId,
      projectName: "Azure Site Recovery - DRP · Permoda",
      industryType: "Distribución de Indumentaria",
      description: "Implementación de plan de recuperación ante desastres con Azure Site Recovery para distribuidor de indumentaria, protegiendo sistemas de inventario, ventas y ERP.",
      previousState: "Sin plan formal de DR. Backup manual de sistemas críticos sin prueba de restauración desde hace 2 años. RTO indefinido ante un desastre. Riesgo de pérdida de datos de inventario y transacciones.",
      newState: "Azure Site Recovery configurado para sistemas críticos con RTO <1 hora. DRP documentado y aprobado por dirección. Drill de recuperación ejecutado exitosamente. RPO <15 minutos para bases de datos transaccionales.",
      companyIconUrl: null,
    },
    {
      offeringId: hubId,
      projectName: "Azure Site Recovery - DRP · Brigard Urrutia",
      industryType: "Servicios Legales",
      description: "Plan de recuperación ante desastres con Azure Site Recovery para reconocido estudio de abogados, protegiendo expedientes digitales, sistemas de gestión de casos y comunicaciones.",
      previousState: "Expedientes legales en servidores físicos sin replicación geográfica. Sin DR documentado. Un incidente de ransomware previo que afectó semanas de operación. Obligación contractual con clientes de garantizar confidencialidad y disponibilidad.",
      newState: "Replicación continua de sistemas con Azure Site Recovery. DR en segunda región Azure con RTO <2 horas. Backup inmutable con Azure Backup contra ransomware. DRP aprobado por los socios directivos y comunicado a clientes clave.",
      companyIconUrl: null,
    },

    // ─── AVD ─────────────────────────────────────────────────────────────────
    {
      offeringId: avdId,
      projectName: "POC Azure Virtual Desktop · Certicamara",
      industryType: "Certificación Digital",
      description: "Prueba de concepto de Azure Virtual Desktop para entidad de certificación digital, evaluando la viabilidad de escritorios virtuales para equipos de auditoría y certificación que requieren acceso seguro a sistemas regulados.",
      previousState: "Auditores accediendo a sistemas de certificación desde equipos locales con VPN. Latencia alta para equipos remotos. Dificultad para controlar el entorno de trabajo de auditores externos. Riesgo de fuga de datos en endpoints no gestionados.",
      newState: "POC exitoso con 20 usuarios piloto. Escritorios virtuales con perfil de seguridad reforzado para auditores. Acceso sin VPN desde cualquier dispositivo con Conditional Access. Cero datos en dispositivo del usuario. Aprobación para despliegue completo obtenida.",
      companyIconUrl: null,
    },
    {
      offeringId: avdId,
      projectName: "POC Azure Virtual Desktop · Azeta",
      industryType: "Operador de Turismo Receptivo",
      description: "Prueba de concepto de Azure Virtual Desktop para operador de turismo receptivo con guías y operadores en múltiples destinos, evaluando la movilidad del puesto de trabajo.",
      previousState: "Guías y coordinadores de turismo trabajando con laptops propias sin estandarización. Acceso a sistemas de reservas mediante VPN inestable. Imposibilidad de trabajar desde destinos turísticos remotos con conexiones limitadas.",
      newState: "POC con 15 usuarios en 4 destinos diferentes. Acceso fluido a sistemas de reservas desde tablets y dispositivos básicos. Experiencia de escritorio consistente independiente del dispositivo. Reducción del 70% en tiempo de soporte IT para equipos remotos.",
      companyIconUrl: null,
    },

    // ─── Azure Arc ───────────────────────────────────────────────────────────
    {
      offeringId: arcId,
      projectName: "Azure ARC · Gire",
      industryType: "Servicios Financieros / Pagos",
      description: "Implementación de Azure Arc para empresa de servicios financieros y pagos, extendiendo el gobierno Azure a servidores on-premise que procesan transacciones de pago y deben cumplir PCI-DSS.",
      previousState: "Servidores on-premise de procesamiento de pagos gestionados con herramientas separadas de Azure. Sin visibilidad unificada del posture de seguridad entre nube e on-premise. Auditorías PCI-DSS requiriendo evidencias manuales de servidores físicos.",
      newState: "Servidores de pago Arc-enabled con visibilidad en Azure Security Center. Políticas de cumplimiento PCI-DSS aplicadas uniformemente en nube y on-premise. Evidencias de auditoría generadas automáticamente. Microsoft Defender for Servers activo en toda la infraestructura.",
      companyIconUrl: null,
    },
    {
      offeringId: arcId,
      projectName: "Azure ARC · Adium",
      industryType: "Farmacéutica",
      description: "Extensión del gobierno Azure a infraestructura híbrida de compañía farmacéutica, gestionando servidores de laboratorio y manufactura GxP desde el plano de control de Azure.",
      previousState: "Servidores GxP en laboratorios gestionados manualmente. Validación de sistemas regulados (FDA/ANMAT) requiriendo documentación manual extensa. Sin control de cambios centralizado en infraestructura de manufactura.",
      newState: "Servidores de laboratorio Arc-enabled con gestión centralizada. Change Management integrado con Azure para sistemas GxP. Evidencias de cumplimiento FDA generadas automáticamente. Tiempo de preparación para auditoría regulatoria reducido un 60%.",
      companyIconUrl: null,
    },

    // ─── Journey to FinOps ────────────────────────────────────────────────────
    {
      offeringId: finopsId,
      projectName: "FinOps Framework · Grupo Empresarial Multicloud",
      industryType: "Tecnología",
      description: "Implementación del framework FinOps sobre tenant Azure con múltiples suscripciones. Azure Function para descubrimiento automático de todas las suscripciones del Tenant Root y consolidación de costos en Power BI.",
      previousState: "Gasto Azure sin visibilidad por equipo. Factura mensual sin desglose por proyecto o área. Recursos huérfanos activos sin responsable asignado. Sin alertas de presupuesto configuradas.",
      newState: "Dashboard FinOps en Power BI con granularidad por suscripción, equipo y entorno. Ahorro del 30%+ en primeros 60 días por right-sizing y eliminación de recursos huérfanos. Chargeback automático por departamento. Budget alerts activos.",
      companyIconUrl: null,
    },
    {
      offeringId: finopsId,
      projectName: "FinOps Optimization · Empresa de Software",
      industryType: "Tecnología",
      description: "Optimización de costos Azure para empresa de software con entornos de desarrollo, staging y producción. Implementación de políticas de apagado automático y uso de spot/reserved instances.",
      previousState: "Entornos no-productivos corriendo 24/7 al mismo costo que producción. Sin reserved instances en workloads predecibles. Gasto creciendo sin correlación con el crecimiento del negocio.",
      newState: "Entornos dev/staging apagados fuera de horario laboral: ahorro 65% en esos ambientes. Reserved instances en workloads base: ahorro adicional del 40%. Gasto estabilizado y alineado al crecimiento de ARR.",
      companyIconUrl: null,
    },
  ];

  const inserted = await db.insert(useCasesTable).values(cases).returning();
  console.log(`\n✅ Inserted ${inserted.length} real use cases`);

  const counts: Record<number, number> = {};
  inserted.forEach(u => { counts[u.offeringId] = (counts[u.offeringId] || 0) + 1; });
  offerings.forEach(o => console.log(`  ${o.name}: ${counts[o.id] || 0} casos`));

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
