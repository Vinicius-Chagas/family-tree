import { Node } from 'relatives-tree/lib/types';

export const nodes = [
  {
    "id": "1",
    "gender": "male",
    "parents": [
      {
        "id": "3",
        "type": "blood"
      },
      {
        "id": "2",
        "type": "blood"
      }
    ],
    "siblings": [],
    "spouses": [],
    "children": []
  },
  {
    "id": "2",
    "gender": "female",
    "parents": [
      {
        "id": "4",
        "type": "blood"
      },
      {
        "id": "5",
        "type": "blood"
      }
    ],
    "siblings": [
      {
        "id": "3",
        "type": "married"
      }
    ],
    "spouses": [],
    "children": [
      {
        "id": "1",
        "type": "blood"
      }
    ]
  },
  {
    "id": "3",
    "gender": "male",
    "parents": [
      {
        "id": "7",
        "type": "blood"
      },
      {
        "id": "6",
        "type": "blood"
      }
    ],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "1",
        "type": "blood"
      }
    ]
  },
  {
    "id": "4",
    "gender": "female",
    "parents": [
      {
        "id": "11",
        "type": "blood"
      },
      {
        "id": "10",
        "type": "blood"
      }
    ],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "2",
        "type": "blood"
      }
    ]
  },
  {
    "id": "5",
    "gender": "female",
    "parents": [
      {
        "id": "9",
        "type": "blood"
      },
      {
        "id": "8",
        "type": "blood"
      }
    ],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "2",
        "type": "blood"
      }
    ]
  },
  {
    "id": "6",
    "gender": "female",
    "parents": [
      {
        "id": "13",
        "type": "blood"
      },
      {
        "id": "12",
        "type": "blood"
      }
    ],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "3",
        "type": "blood"
      }
    ]
  },
  {
    "id": "7",
    "gender": "female",
    "parents": [
      {
        "id": "14",
        "type": "blood"
      },
      {
        "id": "15",
        "type": "blood"
      }
    ],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "3",
        "type": "blood"
      }
    ]
  },
  {
    "id": "8",
    "gender": "female",
    "parents": [],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "5",
        "type": "blood"
      }
    ]
  },
  {
    "id": "9",
    "gender": "female",
    "parents": [],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "5",
        "type": "blood"
      }
    ]
  },
  {
    "id": "10",
    "gender": "female",
    "parents": [],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "4",
        "type": "blood"
      }
    ]
  },
  {
    "id": "11",
    "gender": "female",
    "parents": [],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "4",
        "type": "blood"
      }
    ]
  },
  {
    "id": "12",
    "gender": "female",
    "parents": [],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "6",
        "type": "blood"
      }
    ]
  },
  {
    "id": "13",
    "gender": "female",
    "parents": [],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "6",
        "type": "blood"
      }
    ]
  },
  {
    "id": "14",
    "gender": "female",
    "parents": [],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "7",
        "type": "blood"
      }
    ]
  },
  {
    "id": "15",
    "gender": "female",
    "parents": [],
    "siblings": [],
    "spouses": [],
    "children": [
      {
        "id": "7",
        "type": "blood"
      }
    ]
  }
] as Node[]