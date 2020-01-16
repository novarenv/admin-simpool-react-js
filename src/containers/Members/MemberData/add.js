import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';

import FormWizardValidation from './addValidation.js';

class MemberDataAdd extends Component {
    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Anggota Baru</div>
                </div>

                <FormWizardValidation />
            </ContentWrapper>
        );
    }
}

export default MemberDataAdd;