export const parsePermissions = (permissions) => {
  if (Array.isArray(permissions)) return permissions;
  if (typeof permissions === 'string') {
    try {
      const parsed = JSON.parse(permissions);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const isFullAdmin = (user) => user?.role === 'admin';

export const hasPermission = (user, permission) => {
  if (!user) return false;
  if (isFullAdmin(user)) return true;
  if (user.role === 'staff') {
    return parsePermissions(user.permissions).includes(permission);
  }
  return false;
};

export const canManageUsers = (user) => isFullAdmin(user);

export const canViewCustomers = (user) =>
  isFullAdmin(user) || hasPermission(user, 'customers');

export const canAccessProducts = (user) =>
  isFullAdmin(user) || hasPermission(user, 'products');

export const canAccessFinance = (user) =>
  isFullAdmin(user) || hasPermission(user, 'finance');

export const STAFF_ACCESS_PRESETS = [
  {
    id: 'limited',
    label: 'Limited access',
    description: 'Basic access — admins assign specific permissions below.',
    permissions: [],
  },
  {
    id: 'store-manager',
    label: 'Store manager',
    description: 'Manage products, orders, and customers.',
    permissions: ['products', 'orders', 'customers'],
  },
  {
    id: 'custom',
    label: 'Custom duties',
    description: 'Choose individual access areas below.',
    permissions: [],
  },
];

export const STAFF_PERMISSION_GROUPS = [
  {
    label: 'Catalogue',
    permissions: ['products', 'orders', 'customers', 'dashboard'],
    hint: 'Website catalogue, orders, and customer management.',
  },
  {
    label: 'Other',
    permissions: ['finance', 'reviews', 'settings'],
    hint: 'Finance reports, reviews, and store settings.',
  },
];

export const normalizeStaffPermissions = (permissions = []) => {
  return [...new Set(parsePermissions(permissions))];
};

export const detectStaffPreset = (permissions) => {
  const perms = normalizeStaffPermissions(permissions).sort();
  const match = STAFF_ACCESS_PRESETS.find((preset) => {
    if (preset.id === 'custom') return false;
    const presetPerms = [...preset.permissions].sort();
    return presetPerms.length === perms.length && presetPerms.every((p, i) => p === perms[i]);
  });
  return match?.id || 'custom';
};

export const getStaffAccessSummary = (permissions) => {
  const presetId = detectStaffPreset(permissions);
  const preset = STAFF_ACCESS_PRESETS.find((p) => p.id === presetId);
  if (preset && preset.id !== 'custom') return preset.label;
  const perms = parsePermissions(permissions);
  if (!perms.length) return 'No access assigned';
  return 'Custom access';
};

export const applyPermissionToggle = (current, permission, checked) => {
  let next = [...parsePermissions(current)];
  if (checked) {
    if (!next.includes(permission)) next.push(permission);
  } else {
    next = next.filter((p) => p !== permission);
  }
  return next;
};
