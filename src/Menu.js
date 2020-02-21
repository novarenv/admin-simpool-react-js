const Menu = [
    {
        heading: 'Main Navigation',
        translate: 'sidebar.heading.HEADER'
    },
    {
        name: 'Dashboard',
        path: '/simpool/dashboard',
        icon: 'icon-home',
        translate: 'sidebar.nav.DASHBOARD'
    },
    {
        name: 'Member',
        icon: 'icon-people',
        translate: 'sidebar.nav.member.MEMBERS',
        submenu: [{
                name: 'Member Data',
                path: '/simpool/member/data',
                translate: 'sidebar.nav.member.MEMBER_DATA'
            },
            {
                name: 'Savings',
                path: '/simpool/member/saving-data',
                translate: 'sidebar.nav.member.SAVING_DATA'
            },
            {
                name: 'Loan Data',
                path: '/simpool/member/loan-data',
                translate: 'sidebar.nav.member.LOAN_DATA'
            },
            {
                name: 'User Data',
                path: '/simpool/member/mobile-user',
                translate: 'sidebar.nav.member.USER_DATA'
            }
        ]
    },
    {
        name: 'Transaction',
        icon: 'icon-basket',
        translate: 'sidebar.nav.transaction.TRANSACTIONS',
        submenu: [{
                name: 'Deposit',
                path: '/simpool/transaction/deposit',
                translate: 'sidebar.nav.transaction.DEPOSIT'
            },
            {
                name: 'Withdrawal',
                path: '/simpool/transaction/withdrawal',
                translate: 'sidebar.nav.transaction.WITHDRAWAL'
            },
            {
                name: 'Loan Payment',
                path: '/simpool/transaction/loan-payment',
                translate: 'sidebar.nav.transaction.LOAN_PAYMENT'
            },
            {
                name: 'Transfer',
                path: '/simpool/transaction/transfer',
                translate: 'sidebar.nav.transaction.TRANSFER'
            }
        ]
    },
    {
        name: 'Accounting',
        icon: 'icon-calculator',
        translate: 'sidebar.nav.accountancy.ACCOUNTANCIES',
        submenu: [{
                name: 'Account of Chart',
                path: '/simpool/accounting/account-chart',
                translate: 'sidebar.nav.accountancy.REGISTER_ACCOUNT_CODE'
            },
            {
                name: 'Journal Entry',
                path: '/accountancy/journal-entry',
                translate: 'sidebar.nav.accountancy.JOURNAL_ENTRY'
            },
            {
                name: 'Beginning Balance',
                path: '/simpool/accounting/beginning-balance',
                translate: 'sidebar.nav.accountancy.NEW_ACCOUNT_BALANCE'
            },
            {
                name: 'Transaction Code',
                path: '/accountancy/simpool/transaction-code',
                translate: 'sidebar.nav.accountancy.TRANSACTION_CODE'
            }
        ]
    },
    {
        name: 'Report',
        icon: 'icon-notebook',
        translate: 'sidebar.nav.report.REPORTS',
        submenu: [{
                name: 'Member',
                path: '/report/member',
                translate: 'sidebar.nav.report.MEMBER'
            },
            {
                name: 'Saving',
                path: '/report/saving',
                translate: 'sidebar.nav.report.SAVING'
            },
            {
                name: 'Loan',
                path: '/report/loan',
                translate: 'sidebar.nav.report.LOAN'
            },
            {
                name: 'Accountancy',
                path: '/report/accountancy',
                translate: 'sidebar.nav.report.ACCOUNTANCY'
            }
        ]
    },
    {
        name: 'Setting',
        icon: 'icon-equalizer',
        translate: 'sidebar.nav.setting.SETTINGS',
        submenu: [{
                name: 'Saving Products',
                path: '/setting/saving-products',
                translate: 'sidebar.nav.setting.SAVING_PRODUCTS'
            },
            {
                name: 'Loan Products',
                path: '/setting/loan-products',
                translate: 'sidebar.nav.setting.LOAN_PRODUCTS'
            },
            {
                name: 'Charge Products',
                path: '/setting/charge-products',
                translate: 'sidebar.nav.setting.CHARGE_PRODUCTS'
            },
            {
                name: 'Service Office List',
                path: '/setting/service-office-list',
                translate: 'sidebar.nav.setting.SERVICE_OFFICE_LIST'
            },
            {
                name: 'Biller Management',
                path: '/setting/biller-management',
                translate: 'sidebar.nav.setting.BILLER_MANAGEMENT'
            },
            {
                name: 'Role and Permissions',
                path: '/setting/role-and-permissions',
                translate: 'sidebar.nav.setting.ROLE_AND_PERMISSIONS'
            },
            {
                name: 'Checker Maker',
                path: '/setting/checker-marker',
                translate: 'sidebar.nav.setting.CHECKER_MARKER'
            },
            {
                name: 'Template',
                path: '/setting/template',
                translate: 'sidebar.nav.setting.TEMPLATE'
            }
        ]
    }
];

export default Menu;