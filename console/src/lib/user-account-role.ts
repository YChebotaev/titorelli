export const userAccountRoleToDisplayName = (role: 'owner' | 'viewer' | 'editor' | 'invited') => {
  switch (role) {
    case 'owner': return 'Владелец'
    case 'viewer': return 'Зритель'
    case 'editor': return 'Редактор'
    case 'invited': return 'Приглашен'
    default:
      throw new Error('Unreachable')
  }
}
