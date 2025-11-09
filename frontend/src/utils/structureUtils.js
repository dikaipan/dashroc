/**
 * Structure page utility functions and data
 */

import { getColorMap as getColorMapFromStyles } from '../constants/styles';

/**
 * Get structure data
 * @returns {Object} Structure data object
 */
export function getStructureData() {
  return {
    fsm: {
      name: "Padli Hany Will Aziz",
      title: "Field Service Manager",
      photo: null, // Photo path - set to null if image doesn't exist
      count: 1
    },
    regions: [
      {
        id: 1,
        name: "ROC Region 1",
        coordinator: "Haerudin",
        title: "Region Operation Coordinator",
        photo: null, // Photo path - set to null if image doesn't exist
        color: "blue",
        roles: [
          { title: "Group Area Leader", count: 3 },
          { title: "Senior CE", count: 8 },
          { title: "Engineer Area", count: 25 }
        ]
      },
      {
        id: 2,
        name: "ROC Region 2",
        coordinator: "Teguh Priambodo",
        title: "Region Operation Coordinator",
        photo: null, // Photo path - set to null if image doesn't exist
        color: "purple",
        roles: [
          { title: "Group Area Leader", count: 4 },
          { title: "Senior CE", count: 10 },
          { title: "Engineer Area", count: 30 }
        ]
      },
      {
        id: 3,
        name: "ROC Region 3",
        coordinator: "Leonardo Manullang",
        title: "Region Operation Coordinator",
        photo: null, // Photo path - set to null if image doesn't exist
        color: "green",
        roles: [
          { title: "Group Area Leader", count: 2 },
          { title: "Senior CE", count: 6 },
          { title: "Engineer Area", count: 20 }
        ]
      }
    ]
  };
}

/**
 * Get color map for regions
 * Re-export from constants/styles for backward compatibility
 * @returns {Object} Color map object
 */
export function getColorMap() {
  // Return only the colors used in Structure page
  return {
    blue: getColorMapFromStyles('blue'),
    purple: getColorMapFromStyles('purple'),
    green: getColorMapFromStyles('green'),
  };
}

/**
 * Calculate statistics from structure data
 * @param {Object} structureData - Structure data object
 * @returns {Object} Statistics object
 */
export function calculateStatistics(structureData) {
  return {
    fsm: 1,
    groupAreaLeaders: structureData.regions.reduce((sum, r) => sum + r.roles[0].count, 0),
    seniorCE: structureData.regions.reduce((sum, r) => sum + r.roles[1].count, 0),
    engineerArea: structureData.regions.reduce((sum, r) => sum + r.roles[2].count, 0)
  };
}

