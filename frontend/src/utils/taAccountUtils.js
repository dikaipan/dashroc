/**
 * TA Account Structure utility functions and data
 */

/**
 * Get TA Account structure data
 * @returns {Object} TA Account structure data object
 */
export function getTAAccountData() {
  return {
    taCoordinator: {
      name: "Asep ristanto",
      title: "TA Coordinator",
      photo: null,
      color: "cyan"
    },
    customerAccounts: {
      columns: [
        {
          id: 1,
          customers: [
            "BCA",
            "INTIKOM - BCA",
            "TCR"
          ],
          taName: "Sony Alfian"
        },
        {
          id: 2,
          customers: [
            "BRI"
          ],
          taName: "Aufar Khalis"
        },
        {
          id: 3,
          customers: [
            "BDI",
            "MANDIRI",
            "Bank DANUS",
            "BPD NTT",
            "BJB",
            "BANK MAS",
            "BSB",
            "SINARMAS",
            "BANK NAGARI"
          ],
          taName: "Jeri Permana"
        },
        {
          id: 4,
          customers: [
            "DKI",
            "OCBC",
            "BTN"
          ],
          taName: "Reza Saputro"
        },
        {
          id: 5,
          customers: [
            "BANK INA",
            "BPR KS",
            "BJBS",
            "BNI",
            "CIMB"
          ],
          taName: "Agung Ari"
        },
        {
          id: 6,
          customers: [
            "BANK PAPUA",
            "BSI",
            "DINAR ASHRI",
            "BANK SUMENEP",
            "BPD KALSEL",
            "MESTIKA",
            "QNB",
            "BPD Sumut",
            "BANK JATIM",
            "BANK RIAU",
            "ATMi-PTPR",
            "ATMI-OY"
          ],
          taName: "Zaeludin"
        }
      ]
    },
    remoteGuidanceMonitoring: {
      helpdeskCoordinator: [
        {
          name: "Hamim",
          title: "Helpdesk Coordinator",
          photo: null
        }
      ],
      helpdeskAllCustomer: [
        {
          name: "Fajar Nurohman",
          title: "Helpdesk All Customer",
          photo: null
        },
        {
          name: "Rizaldy",
          title: "Helpdesk All Customer",
          photo: null
        }
      ],
      groupAreaLeaders: [
        {
          name: "Yogi",
          area: "Jawa Timur",
          title: "Group Area Leader / Senior Engineer",
          photo: null
        },
        {
          name: "Bagus Anugrah",
          area: "Sumatera",
          title: "Group Area Leader / Senior Engineer",
          photo: null
        },
        {
          name: "Febri Nugroho",
          area: "Jawa Tengah & DIY",
          title: "Group Area Leader / Senior Engineer",
          photo: null
        },
        {
          name: "Arianto",
          area: "Sulawesi",
          title: "Group Area Leader / Senior Engineer",
          photo: null
        }
      ],
      availability: "7x24 Hours"
    },
    supportPersonnel: {
      technicalAssistanceBackup: [
        {
          name: "Rizaldy",
          title: "Technical Assistance Backup",
          photo: null
        },
        {
          name: "Fajar nurohman",
          title: "Technical Assistance Backup",
          photo: null
        }
      ],
      technicalAnalysts: [
        {
          name: "Yaumil Fazri",
          title: "Technical Analyst",
          specialization: "uptime and machine performance",
          photo: null
        },
        {
          name: "Eko Abdul rachman",
          title: "Technical Analyst",
          specialization: "cassette and 3rd party development",
          photo: null
        },
        {
          name: "Anastasya Rosalyn",
          title: "Technical Analyst",
          specialization: "admin",
          photo: null
        },
        {
          name: "Fitriyanto Aji P",
          title: "Technical Analyst",
          specialization: null,
          photo: null
        }
      ],
      helpdeskBabyPart: [
        {
          name: "Hamim",
          title: "Helpdesk + Baby part",
          photo: null
        }
      ]
    }
  };
}

/**
 * Get all customers from all columns as a flat list
 * @param {Object} taAccountData - TA Account data object
 * @returns {Array} Array of customer objects with name and taName
 */
export function getAllCustomers(taAccountData) {
  const customers = [];
  taAccountData.customerAccounts.columns.forEach((column) => {
    column.customers.forEach((customerName) => {
      customers.push({
        name: customerName,
        taName: column.taName,
        columnId: column.id
      });
    });
  });
  return customers;
}

/**
 * Get customer by name
 * @param {Object} taAccountData - TA Account data object
 * @param {string} customerName - Customer name to find
 * @returns {Object|null} Customer object or null
 */
export function getCustomerByName(taAccountData, customerName) {
  const allCustomers = getAllCustomers(taAccountData);
  return allCustomers.find(c => c.name === customerName) || null;
}

/**
 * Get customers by TA name
 * @param {Object} taAccountData - TA Account data object
 * @param {string} taName - TA name
 * @returns {Array} Array of customer names
 */
export function getCustomersByTA(taAccountData, taName) {
  const column = taAccountData.customerAccounts.columns.find(col => col.taName === taName);
  return column ? column.customers : [];
}

/**
 * Calculate statistics for TA Account structure
 * @param {Object} taAccountData - TA Account data object
 * @returns {Object} Statistics object
 */
export function calculateTAStatistics(taAccountData) {
  const totalCustomers = taAccountData.customerAccounts.columns.reduce(
    (sum, col) => sum + col.customers.length,
    0
  );
  
  return {
    taCoordinator: 1,
    totalCustomers: totalCustomers,
    helpdeskCoordinator: taAccountData.remoteGuidanceMonitoring.helpdeskCoordinator.length,
    helpdeskAllCustomer: taAccountData.remoteGuidanceMonitoring.helpdeskAllCustomer.length,
    groupAreaLeaders: taAccountData.remoteGuidanceMonitoring.groupAreaLeaders.length,
    technicalAssistanceBackup: taAccountData.supportPersonnel.technicalAssistanceBackup.length,
    technicalAnalysts: taAccountData.supportPersonnel.technicalAnalysts.length,
    helpdeskBabyPart: taAccountData.supportPersonnel.helpdeskBabyPart.length
  };
}

