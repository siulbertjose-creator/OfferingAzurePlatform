import { db, offeringsTable, useCasesTable } from "@workspace/db";

async function seed() {
  console.log("Seeding offerings...");

  const offerings = await db
    .insert(offeringsTable)
    .values([
      {
        name: "Journey to FinOps",
        durationHours: "50 horas",
        techPillar: "IaC + Serverless",
        businessBenefit: "Control total del gasto sin esfuerzo manual.",
        whatIsIt:
          "Un marco de optimización financiera desplegado 100% mediante IaC y CI/CD. Utiliza una Azure Function para el descubrimiento automático de todas las suscripciones del Tenant Root y consolida la visibilidad de costos en un dashboard de Power BI autogestionado.",
        whatDoesItSolve:
          "Centraliza la visibilidad de costos dispersos entre múltiples suscripciones y equipos. Elimina la necesidad de revisión manual de facturas, automatiza las alertas de presupuesto y habilita un modelo FinOps maduro donde cada equipo es responsable de su propio gasto en la nube.",
      },
      {
        name: "Azure Cloud Infrastructure Management (ACIM)",
        durationHours: "40 horas",
        techPillar: "Azure Auditor / SCA",
        businessBenefit: "Salud de plataforma constante y proactiva.",
        whatIsIt:
          "Gestión avanzada de infraestructura potenciada por el ecosistema de herramientas de Readymind: Azure Auditor, SCA y Discovery Maps. Proporciona visibilidad cognitiva y mapeo automático de todos los recursos del Tenant.",
        whatDoesItSolve:
          "La falta de gobierno y visibilidad técnica sobre los recursos Azure. Gracias al análisis cognitivo y mapeo automático, permite mantener una infraestructura auditable, segura y alineada con el Well-Architected Framework de Microsoft de forma continua.",
      },
      {
        name: "Accelerator Azure Virtual Desktop (AVD)",
        durationHours: "60 horas",
        techPillar: "VDI Escalable",
        businessBenefit: "Movilidad total con seguridad de grado empresarial.",
        whatIsIt:
          "Despliegue acelerado de escritorios virtuales y aplicaciones en la nube con un enfoque en rendimiento y seguridad. Aprovecha las capacidades nativas de Azure para ofrecer una experiencia de escritorio gestionada, escalable y segura desde cualquier dispositivo.",
        whatDoesItSolve:
          "La complejidad de la administración del puesto de trabajo remoto. Reduce costos operativos mediante la multisesión de Windows, simplifica la gestión de imágenes y licencias, y asegura que todos los accesos remotos cumplan con las políticas de seguridad corporativas.",
      },
      {
        name: "Landing Zone Design: Hub & Spoke",
        durationHours: "TBD",
        techPillar: "Hub & Spoke",
        businessBenefit: "Escalabilidad infinita y control de red.",
        whatIsIt:
          "Diseño e implementación de la arquitectura base de red en Azure, siguiendo un modelo de topología centralizada (Hub) con redes de carga de trabajo (Spokes). Incluye Azure Firewall, DNS privado, VPN/ExpressRoute y segmentación de redes por entorno.",
        whatDoesItSolve:
          "El caos en el crecimiento no planificado de la red. Centraliza servicios compartidos como Firewall, DNS y VPN en el Hub, garantiza el aislamiento de cargas de trabajo en los Spokes y establece una base de red segura y auditada que escala con el negocio sin necesidad de rediseños.",
      },
      {
        name: "Road to Cloud with Azure Migrate (CAF)",
        durationHours: "60 horas",
        techPillar: "Metodología CAF",
        businessBenefit: "Migración segura y sin sorpresas técnicas.",
        whatIsIt:
          "Consultoría y ejecución de migraciones hacia Azure utilizando el Cloud Adoption Framework de Microsoft como hoja de ruta. Cubre desde el discovery del entorno on-premises hasta el cutover y validación en producción.",
        whatDoesItSolve:
          "Mitiga el riesgo de interrupción del servicio durante la transición a la nube. Asegura que el paso de on-premises a Azure sea eficiente, predecible y alineado con los objetivos de negocio, minimizando el tiempo de inactividad y los costos imprevistos del proceso de migración.",
      },
      {
        name: "Infraestructura Híbrida con Azure Arc",
        durationHours: "TBD",
        techPillar: "Gobernanza Híbrida",
        businessBenefit: "Control unificado de toda la IT (multicloud).",
        whatIsIt:
          "Extensión del plano de control de Azure hacia entornos locales, otras nubes (AWS, GCP) o el Edge. Permite gestionar servidores, clústeres Kubernetes y bases de datos externas como si fueran recursos nativos de Azure.",
        whatDoesItSolve:
          "La fragmentación operativa de entornos híbridos y multicloud. Permite aplicar políticas de cumplimiento, seguridad y gestión de inventario de forma unificada, tratando cualquier servidor externo como un recurso de primera clase dentro del ecosistema Azure.",
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`✅ Inserted ${offerings.length} offerings`);

  if (offerings.length > 0) {
    const acimId = offerings.find(o => o.name.includes("ACIM"))?.id;
    const finopsId = offerings.find(o => o.name.includes("FinOps"))?.id;
    const avdId = offerings.find(o => o.name.includes("Virtual Desktop"))?.id;

    const cases = [];

    if (acimId) {
      cases.push(
        {
          offeringId: acimId,
          projectName: "Migración a Cloud Híbrida para Banca Digital",
          industryType: "Servicios Financieros",
          description:
            "Transformación completa de la infraestructura on-premise hacia una arquitectura cloud híbrida en Azure, logrando una reducción del 42% en costos operativos y mejorando la disponibilidad del sistema al 99.99%.",
          previousState:
            "Infraestructura on-premise envejecida con múltiples silos de datos, tiempos de inactividad frecuentes de hasta 4 horas mensuales y costos operativos en aumento. Sin visibilidad centralizada del parque tecnológico.",
          newState:
            "Arquitectura híbrida Azure con Landing Zone Hub & Spoke, monitoreo centralizado en Azure Monitor y reducción del 42% en costos operativos. Disponibilidad del 99.99% garantizada con SLA contractual.",
          companyIconUrl: null,
        },
        {
          offeringId: acimId,
          projectName: "Modernización de Core Bancario con Microservicios",
          industryType: "Servicios Financieros",
          description:
            "Refactorización del sistema core bancario monolítico hacia microservicios en Azure Kubernetes Service. Implementación de API Management y CI/CD con Azure DevOps.",
          previousState:
            "Monolito bancario de 15 años con ciclos de release de 3 meses, equipos bloqueados entre sí y deuda técnica crítica acumulada. Tiempo medio de resolución de incidentes: 8 horas.",
          newState:
            "Arquitectura de microservicios sobre AKS con 12 servicios independientes. Ciclos de release semanales, tiempo de resolución de incidentes reducido a 45 minutos y cobertura de tests al 85%.",
          companyIconUrl: null,
        },
      );
    }

    if (finopsId) {
      cases.push({
        offeringId: finopsId,
        projectName: "Plataforma de IA para Manufactura Inteligente",
        industryType: "Manufactura",
        description:
          "Diseño e implementación de una plataforma de inteligencia artificial en Azure para optimización de líneas de producción con Azure IoT Hub y Machine Learning.",
        previousState:
          "Sin visibilidad de costos cloud por equipo. Facturas mensuales de $180k USD sin desglose por proyecto. Equipos de manufactura sin accountability financiero sobre sus recursos.",
        newState:
          "Dashboard FinOps en Power BI con granularidad por equipo, proyecto y entorno. Ahorro del 28% en 3 meses gracias a right-sizing automatizado y eliminación de recursos huérfanos.",
        companyIconUrl: null,
      });
    }

    if (avdId) {
      cases.push({
        offeringId: avdId,
        projectName: "Escritorios Virtuales para Fuerza Laboral Remota",
        industryType: "Retail",
        description:
          "Despliegue de Azure Virtual Desktop para 800 usuarios remotos de cadena retail, sustituyendo VPN tradicional y equipos físicos de alto costo.",
        previousState:
          "800 laptops corporativas con costo de renovación de $1.2M cada 3 años. VPN inestable con latencias >200ms. Helpdesk saturado con incidencias de conectividad.",
        newState:
          "AVD multiselección con Windows 11 Enterprise. BYOD habilitado desde cualquier dispositivo. Costo reducido en 65% respecto a modelo anterior. Latencia <30ms con proximity placement groups.",
        companyIconUrl: null,
      });
    }

    if (cases.length > 0) {
      const inserted = await db.insert(useCasesTable).values(cases).onConflictDoNothing().returning();
      console.log(`✅ Inserted ${inserted.length} use cases`);
    }
  }

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
