const Menu = [
    {
        heading: 'Main Navigation',
        translate: 'sidebar.heading.HEADER'
    },
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'icon-speedometer',
        translate: 'sidebar.nav.DASHBOARD'
    },
    {
        name: 'Members',
        icon: 'icon-chemistry',
        translate: 'sidebar.nav.member.MEMBERS',
        submenu: [{
                name: 'Member Data',
                path: '/member/data',
                translate: 'sidebar.nav.member.MEMBER_DATA'
            },
            {
                name: 'Saving Data',
                path: '/member/saving-data',
                translate: 'sidebar.nav.member.SAVING_DATA'
            },
            {
                name: 'Loan Data',
                path: '/member/loan-data',
                translate: 'sidebar.nav.member.LOAN_DATA'
            },
            {
                name: 'User Data',
                path: '/member/user-data',
                translate: 'sidebar.nav.member.USER_DATA'
            }
        ]
    },
    {
        name: 'Transactions',
        icon: 'icon-speedometer',
        translate: 'sidebar.nav.transaction.TRANSACTIONS',
        submenu: [{
                name: 'Deposit',
                path: '/transaction/deposit',
                translate: 'sidebar.nav.transaction.DEPOSIT'
            },
            {
                name: 'Withdrawal',
                path: '/transaction/withdrawal',
                translate: 'sidebar.nav.transaction.WITHDRAWAL'
            },
            {
                name: 'Installments',
                path: '/transaction/loan-payment',
                translate: 'sidebar.nav.transaction.INSTALLMENTS'
            },
            {
                name: 'Transfer',
                path: '/transaction/transfer',
                translate: 'sidebar.nav.transaction.TRANSFER'
            }
        ]
    },
    {
        name: 'Accountancies',
        icon: 'icon-chemistry',
        translate: 'sidebar.nav.accountancy.ACCOUNTANCIES',
        submenu: [{
                name: 'Register Account Code',
                path: '/accountancy/register-account-code',
                translate: 'sidebar.nav.accountancy.REGISTER_ACCOUNT_CODE'
            },
            {
                name: 'Journal Entry',
                path: '/accountancy/journal-entry',
                translate: 'sidebar.nav.accountancy.JOURNAL_ENTRY'
            },
            {
                name: 'Journal Entry',
                path: '/accountancy/journal-entry',
                translate: 'sidebar.nav.accountancy.JOURNAL_ENTRY'
            },
            {
                name: 'New Account Balance',
                path: '/accountancy/new-account-balance',
                translate: 'sidebar.nav.accountancy.NEW_ACCOUNT_BALANCE'
            },
            {
                name: 'Transaction Code',
                path: '/accountancy/transaction-code',
                translate: 'sidebar.nav.accountancy.TRANSACTION_CODE'
            }
        ]
    },
    {
        name: 'Reports',
        icon: 'icon-speedometer',
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
        name: 'Settings',
        icon: 'icon-chemistry',
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