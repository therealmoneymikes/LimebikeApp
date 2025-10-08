

export interface DrawerMenuProvider {
  handleWalletAction: () => void;
  handleHistoryAction: () => void;
  handleSafetyCenterAction: () => void;
  handleDonationAction: () => void;
  handleHelpAction: () => void;
  handleSettingsAction: () => void;
  handleCloseMenuAction: () => void;
}
