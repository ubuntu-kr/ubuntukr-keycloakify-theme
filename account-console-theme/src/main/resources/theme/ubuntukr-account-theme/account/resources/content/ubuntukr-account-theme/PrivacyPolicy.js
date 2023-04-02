/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "../../../../common/keycloak/web_modules/react.js";
import { AccountServiceContext } from "../../account-service/AccountServiceContext.js";
import { Msg } from "../../widgets/Msg.js";

// No JSX - no compilation needed
export class PrivacyPolicy extends React.Component {
    static contextType = AccountServiceContext;
    privacyPolicyUrl = "https://disclosures.ubuntu-kr.org/privacy-policy/";
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.open(this.privacyPolicyUrl, '_blank');
    }

    render() {
        const e = React.createElement;
        return e('div', {class: 'pf-c-card'}, [
            
            e('div', {class: 'pf-c-card__body'}, [
                e('p', null, Msg.localize('privacyPolicy_body')),
            ]),

            e('div', {class: 'pf-c-card__body'}, [
                e("a", {
                    href: this.privacyPolicyUrl,
                    children: Msg.localize('privacyPolicy_linkText')
                  }),
            ])
        ]);
    }
};