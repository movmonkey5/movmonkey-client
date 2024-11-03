import Container from "@/components/shared/Container";
import React from "react";

export default function TermsConditionPage() {
  return (
    <div className="max-sm:break-all">
      {" "}
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl lg:mt-20">
          User Responsibilities on MovMonkey’s Platform
        </div>
        <Container>
          <div className="space-y-2 px-5 text-xl leading-[45px] md:text-2xl">
            <p>
              {`Our platform facilitates removal, delivery, and cleaning service connections and processes
payments, creating direct dealings between drivers and customers.`}
            </p>
            <p className="pt-8">
              {`By engaging with the platform for any service, you affirm that:`}
            </p>
            <ul className="list-disc pt-1 text-xl md:text-2xl">
              <li className="ml-9">
                You possess the legal capacity to agree to and comply with these
                terms.
              </li>
              <li className="ml-9">
                The platform’s use is for your personal purposes, not for
                resale.
              </li>
              <li className="ml-9">
                {` You meet the age requirement per your region's laws, typically
                18 or older.`}
              </li>
              <li className="ml-9">
                {`You’re limited to one account per role (driver and customer).`}
              </li>
              <li className="ml-9">
                You’ll safeguard your account credentials and any identification
                we provide.
              </li>
              <li className="ml-9">
                {`Upon request by MovMonkey, you will verify your identity without impersonation.`}
              </li>
              <li className="ml-9">{`Drivers are to use a genuine photo for their profile.`}</li>
              <li className="ml-9">{`Any claims of association with MovMonkey must be truthful.`}</li>
              <li className="ml-9">
                {`Legal and platform rules must be observed during use or service provision.`}
              </li>
              <li className="ml-9">
                {`Illegal activities, fraud, harmful promotions, or criminal assistance through the platform are prohibited.`}
              </li>
              <li className="ml-9">
                {`Confidentiality of information received from other users is paramount, and it should only be used for service-related purposes.`}
              </li>
              <li className="ml-9">
                {`Accumulating or storing user information beyond what is necessary for the service is not allowed.`}
              </li>
              <li className="ml-9">
                {`Soliciting platform users to switch to competitor services is forbidden.`}
              </li>
              <li className="ml-9">
                {`Communication with other users should be strictly for service facilitation and cease post-service completion.`}
              </li>
              <li className="ml-9">
                {`Harassment, intimidation, or disturbance of other users or MovMonkey staff is unacceptable.`}
              </li>
              <li className="ml-9">
                {`Reproducing or distributing content from the website or platform without MovMonkey’s consent is prohibited.`}
              </li>
              <li className="ml-9">
                {`Actions that negatively affect other users’ experiences or service provision are prohibited.`}
              </li>
              <li className="ml-9">
                {`Infringing on others’ copyright, privacy, contractual rights, or engaging in discriminatory practices is prohibited.`}
              </li>
              <li className="ml-9">
                {`Assisting others in violating these guidelines is not permitted.`}
              </li>
              <li className="ml-9">
                {`If MovMonkey requests identification documentation from you, you must comply immediately to avoid having your account suspended.`}
              </li>
            </ul>
          </div>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl ">
          MovMonkey Customer Agreement
        </div>
        <Container>
          <p className="mt-3 text-xl md:text-2xl">
            {`The "MovMonkey Customer Agreement" forms an integral part of MovMonkey's broader Terms
             & Conditions, incorporated by reference. By utilizing the platform and requesting removal,
             delivery, and cleaning services, each customer acknowledges, represents, and warrants the
             following:`}
          </p>
          <ul className="list-disc pt-8 text-xl md:text-2xl">
            <li className="ml-9">
              <span className=" pr-2 font-semibold">Age and Authority:</span>
              Customers confirm they are at least 18 years old and possess the
              legal authority to utilize the services and contract for jobs.
            </li>
            <li className="ml-9">
              <span className=" pr-2 font-semibold">Item Disclosure:</span>
              {`Customers agree to disclose all items included in a job to the
              driver before acceptance, adhering to MovMonkey's Prohibited Items
              list. MovMonkey reserves the right to dispose of any prohibited
              items and instruct drivers accordingly.`}
            </li>
            <li className="ml-9">
              <span className=" pr-2 font-semibold">Special Items:</span>
              {`Unless otherwise agreed in writing, customers shall not include special items in jobs. MovMonkey disclaims responsibility for such items and retains disposal rights.`}
            </li>
            <li className="ml-9">
              <span className=" pr-2 font-semibold">
                Packing Responsibility:
              </span>
              {`Customers are responsible for adequately packing items, including live animals, to ensure safe transport and compliance with relevant laws.`}
            </li>
            {/* <li className="ml-9">
              <span className=" pr-2 font-semibold">Animal Welfare:</span>
              {`Customers may not arrange jobs involving euthanasia or similar services for live animals.`}
            </li> */}
            <li className="ml-9">
              <span className=" pr-2 font-semibold">Platform Usage:</span>
              {`Customers must use the MovMonkey Platform exclusively to contract with drivers and service providers and refrain from sharing personal information outside the platform, as their information is only shared with their chosen driver or service provider. We do not send a driver or service provider to your property prior to the execution of the job. We have provided enough features and technology to facilitate smooth communication and transmission between you, drivers, and service providers.`}
            </li>
            <li className="ml-9">
              <span className=" pr-2 font-semibold">Non-Discrimination:</span>
              {`Customers must not discriminate or harass others based on protected characteristics.`}
            </li>
            <li className="ml-9">
              <span className=" pr-2 font-semibold">Insurance:</span>
              {` Customers were advised to get their personal insurance to cover their items, which includes cargo insurance in case of freight. and MovMonkey isn't responsible for any job-related losses or damages.`}
            </li>
            <li className="ml-9">
              <span className=" pr-2 font-semibold">Indemnification:</span>
              {`Customers indemnify MovMonkey against claims arising from their actions, content, or platform usage.`}
            </li>
            <li className="ml-9">
              <span className=" pr-2 font-semibold">
                Representation and Compliance:
              </span>
              {`Customers affirm their status as bona fide business entities or individuals, commit to commercial use of the platform, and agree not to disclose personal information or contact users outside the platform without permission.`}
            </li>
            <li className="ml-9">
              <span className=" pr-2 font-semibold">
                Statute of Limitations:
              </span>
              {`Any claims arising from the agreement between customers, drivers, and service providers must be filed within the week of job execution.`}
            </li>
            <li className="ml-9">
              <span className=" pr-2 font-semibold">Termination:</span>
              {`MovMonkey reserves the right to terminate customer accounts or access to the platform for non-compliance with the agreement or terms, with no liability for such termination.`}
            </li>
          </ul>
          <p className="pt-8 text-xl md:text-2xl">
            For any further inquiries, please get in touch with{" "}
            <span className="font-semibold">support@movmonkey.com.</span>
          </p>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl ">
          Customer’s Terms of Use
        </div>
        <Container>
          <p className="mt-3 text-xl md:text-2xl">
            The{" "}
            <span className="font-semibold">
              &quot;Terms and Conditions&quot;
            </span>{" "}
            establish the required conditions stipulated by MovMonkey, which you
            must consent to if you wish to access or utilize the MovMonkey
            platform{" "}
            <span className="font-semibold">(&quot;Platform&quot;)</span> via
            our website located at{" "}
            <span className="font-semibold">
              www.MovMonkey.com (&quot;Website&quot;)
            </span>{" "}
            for either receiving Removal, Delivery, and Cleaning Services from
            or providing Removal, Delivery, and Cleaning Services to other users
            of the platform. These terms, whether explicitly stated or
            referenced herein, constitute a binding legal agreement between you
            and MovMonkey. By engaging with or accessing the platform in any
            capacity, including receiving or providing removal, delivery, and
            cleaning services, you explicitly acknowledge and agree to abide by
            these terms and any prospective amendments or additions, as
            published periodically on our website. Upon your utilization of the
            platform, or upon receiving or offering removal, delivery, and
            cleaning services, you assume the status of a{" "}
            <span className="font-semibold">&quot;user&quot;</span> of
            MovMonkey&#39;s platform, whether categorized as a{" "}
            <span className="font-semibold">
              &quot;driver&quot;, &quot;service provider&quot;, or
              &quot;customer&quot;
            </span>{" "}
            as stated.
          </p>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl ">
          Connect both Removal & Delivery drivers, Cleaning service and
          customers
        </div>
        <Container>
          <p className="mt-3 text-xl md:text-2xl">
            MovMonkey serves as a hub for individuals or businesses (referred to
            as <span className="font-semibold">&quot;customers&quot;</span>)
            needing assistance with cleaning, transporting, moving, or
            delivering items (referred to as{" "}
            <span className="font-semibold">
              &quot;removal&quot;, &quot;delivery&quot;, and &quot;cleaning
              services&quot;
            </span>
            ) and those willing to provide these services (referred to as
            <span className="font-semibold">
              &quot;drivers&quot; or &quot;service providers&quot;
            </span>
            ). When a driver or service provider completes removal, delivery,
            and cleaning services for a customer within a specified timescale
            and for specific items, it constitutes a{" "}
            <span className="font-semibold">&quot;job.&quot;</span> Both drivers
            and customers are considered{" "}
            <span className="font-semibold">&quot;users&quot;</span> of our
            platform.
          </p>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl ">
          Our platform is totally free for customers to use
        </div>
        <Container>
          <p className="mt-3 text-xl md:text-2xl">{`There is no hidden fee. We connect independent drivers, or service providers seeking to fulfil jobs for customers, with those who need such services. Drivers and service providers are self-employed individuals who opt to offer removal, delivery, and cleaning services for jobs listed on our platform. We, MovMonkey, do not control the timing of when a customer posts a job or when a driver decides to bid on a job. Agreeing to provide removal, delivery, and cleaning services for customers through our platform does not prevent a driver from working on other platforms or for other individuals simultaneously`}</p>
          <p className="pt-8 text-xl md:text-2xl">{`MovMonkey is a platform that connects drivers and customers, also known as customers. Drivers and service providers decide whether to bid on and provide delivery and removal services requested by a customer.`}</p>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl lg:mt-20">
          {`MovMonkey's limited responsibility for user's actions`}
        </div>
        <Container>
          <div className="space-y-2 px-5 text-xl leading-[45px] md:text-2xl">
            <p>
              {`While our platform helps users connect for removal, delivery, and cleaning services and facilitates payments, all transactions made through it are solely between drivers and customers. MovMonkey merely serves as a platform to bring users together for jobs. We have no control over and are not accountable for the actions or inactions of any user, whether related to the platform's use or the provision or receipt of removal, delivery, and cleaning services, whether in public, private, or offline interactions or otherwise. Hence, users must adhere to specific guidelines to maintain the platform's usefulness for all parties involved.`}
            </p>
            <p className="pt-8">
              {`Each time a user accesses or uses the platform or receives or performs removal, delivery, and
                cleaning services through it, they confirm that they:`}
            </p>
            <ul className="list-disc pt-1 text-xl md:text-2xl">
              <li className="ml-9">
                Have the legal right, authority, and capacity to agree to these
                terms and fulfil their obligations.
              </li>
              <li className="ml-9">
                {`Use the platform for personal use only, and don't resell it to
                others.`}
              </li>
              <li className="ml-9">
                {`Are of legal age to use the platform or perform removal, delivery, and cleaning services as required by their jurisdiction.`}
              </li>
              <li className="ml-9">
                {`Will maintain only one driver, one service provider, and one customer account.`}
              </li>
              <li className="ml-9">
                Will keep their account password or any provided identification
                confidential and secure.
              </li>
              <li className="ml-9">
                {`Will provide proof of identity upon request and won't impersonate others or misrepresent themselves.`}
              </li>
              <li className="ml-9">{`Won't claim to be associated with MovMonkey as an agent, representative, or employee.`}</li>
              <li className="ml-9">{`Will use the platform and perform removal, delivery, and cleaning services lawfully and in accordance with all applicable laws.`}</li>
              <li className="ml-9">
                {`I won't use the platform for illegal activities, fraud, or promoting criminal behaviour.`}
              </li>
              <li className="ml-9">
                {`Will keep confidential any third-party information obtained while using the platform.`}
              </li>
              <li className="ml-9">
                {`We won't collect or store information about other users beyond what's necessary for job performance.`}
              </li>
              <li className="ml-9">
                {`Won't divert users away from the platform to other similar services.`}
              </li>
              <li className="ml-9">
                {`I won't contact other users outside the platform except as necessary for job-related communication.`}
              </li>
              <li className="ml-9">
                {`We won't harass or threaten any third party, including additional MovMonkey users and MovMonkey staff.`}
              </li>
              <li className="ml-9">
                {`We won't reproduce or distribute platform-related content without written permission.`}
              </li>
              <li className="ml-9">
                {`I won't use the platform in a way that disrupts other users' experiences.`}
              </li>
              <li className="ml-9">
                {`Won't violate any third party's rights, including intellectual property, privacy, or contractual rights.`}
              </li>
              <li className="ml-9">
                {`I won't discriminate against others based on specific traits.`}
              </li>
              <li className="ml-9">
                {`I won't assist others in violating these rules.`}
              </li>
            </ul>
            <p className="pt-8">
              {`According to MovMonkey, failure to provide identity proof may result in account suspension or
                termination. MovMonkey's Non-Discrimination Policy`}
            </p>
            <p className="pt-8">
              {`MovMonkey is committed to creating an inclusive environment where discrimination has no place. We stand against any form of bias towards users or anyone else, be it due to their race, faith, country of origin, disabilities, sexual preferences, gender identity, relationship status, age, or any legally protected trait. We aim to make every user feel valued and included, maintaining a strict policy against discriminatory acts. This policy extends to rejecting or
              cancelling tasks simply because of the demographic profile of a neighbourhood or any personal bias against individuals   for reasons such as their age, background, disability, gender identity, marital status, nationality, race, religious   beliefs, sex, or who they love.`}
            </p>
          </div>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl ">
          Customer Responsibility for Driver Verification
        </div>
        <Container>
          <p className="mt-3 text-xl md:text-2xl">{`Before entrusting a driver with their jobs, customers are solely responsible for confirming their identity and making sure it corresponds to the data the driver or service provider has provided on the website.`}</p>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl ">
          Customer Screening
        </div>
        <Container>
          <p className="mt-3 text-xl md:text-2xl">{`MovMonkey does not routinely perform background checks or screenings on customers who use our platform for removal, delivery, and cleaning services. However, we do hold the right to conduct such checks on customers of our own choice. Remember, any checks we might do shouldn't stop you from using your judgement when interacting with others through our service. Always prioritise safety and apply common sense during any interaction or task. Using our platform, all users understand and accept that they might encounter third parties or situations through jobs that could be risky, offensive, harmful, or otherwise unpleasant. Users also agree to hold MovMonkey harmless from any losses, damages, or liabilities that might arise from their use of the platform.`}</p>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl lg:mt-20">
          Rules on Job Contents Banned Items
        </div>
        <Container>
          <div className="space-y-2 px-5 text-xl leading-[45px] md:text-2xl">
            <p>
              {`Customers cannot include, and drivers cannot accept, jobs with these "banned items":`}
            </p>

            <ul className="list-disc pt-8 text-xl md:text-2xl">
              <li className="ml-9">Any illegal items, such as drugs</li>
              <li className="ml-9">
                The platform’s use is for your personal purposes, not for
                resale.
              </li>
              <li className="ml-9">{` Hazardous Waste`}</li>
              <li className="ml-9">
                {`Unset precious stones, gold, or platinum in raw form.`}
              </li>
              <li className="ml-9">
                Hazardous materials were not categorized correctly.
              </li>
              <li className="ml-9">
                {`Cigarettes, alcohol, or products regulated by the Alcohol and Tobacco Tax and Trade Bureau.`}
              </li>
              <li className="ml-9">{`Firearms, weapons, or ammunition.`}</li>
              <li className="ml-9">{`Common fireworks or replica explosives.`}</li>
              <li className="ml-9">{`Prescription drugs or human remains.`}</li>
              <li className="ml-9">{`People`}</li>
              <li className="ml-9">
                {`Special items are mentioned below unless approved by MovMonkey.`}
              </li>
            </ul>
          </div>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl lg:mt-20">
          Special items
        </div>
        <Container>
          <div className="space-y-2 px-5 text-xl leading-[45px] md:text-2xl">
            <p>
              {`Only some customers with permission from MovMonkey can offer jobs with "special items," like`}
            </p>

            <ul className="list-disc pt-8 text-xl md:text-2xl">
              <li className="ml-9">
                Heavy or oversized items over 400 lbs. or exceeding 12 feet in
                any dimension.
              </li>
              <li className="ml-9">
                Live animals or do jobs related to animal euthanasia.
              </li>
              <li className="ml-9">{` Drivers may need special licences or equipment for such jobs.`}</li>
              <li className="ml-9">
                {`Some special items may require drivers to be 21 and have specific qualifications or permits. The customer must check if the driver is qualified.`}
              </li>
              <li className="ml-9">
                Drivers, service providers, and customers need to follow federal
                and state laws regarding pick-up and delivery locations and
                comply.
              </li>
              <li className="ml-9">
                {`Cigarettes, alcohol, or products regulated by the Alcohol and Tobacco Tax and Trade Bureau.`}
              </li>
              <li className="ml-9">{`Firearms, weapons, or ammunition.`}</li>
              <li className="ml-9">{`Common fireworks or replica explosives.`}</li>
              <li className="ml-9">{`Prescription drugs or human remains.`}</li>
              <li className="ml-9">{`People`}</li>
              <li className="ml-9">
                {`Special items are mentioned below unless approved by MovMonkey.`}
              </li>
            </ul>
          </div>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl lg:mt-20">
          Refund Policy Guidelines
        </div>
        <Container>
          <div className="space-y-2 px-5 text-xl leading-[45px] md:text-2xl">
            <p>
              {`If a driver or service provider fails to fulfil their delivery obligations, a customer can request a
                refund of the MovMonkey Magnum Fee. Refunds may be warranted in situations such as:`}
            </p>

            <ul className="list-disc pt-8 text-xl md:text-2xl">
              <li className="ml-9">
                The driver or service provider claims a vehicle malfunctioned
                after booking.
              </li>
              <li className="ml-9">
                The driver or service provider cites a family emergency
                preventing the completion of the job.
              </li>
              <li className="ml-9">{`The driver or service provider fails to initiate contact to arrange the job.`}</li>
              <li className="ml-9">
                {`The driver or service provider doesn't show up as agreed.`}
              </li>
            </ul>

            <p className="pt-8">
              {`However, a customer isn't entitled to a full refund in cases
              where:`}
            </p>

            <ul className="list-disc pt-8 text-xl md:text-2xl">
              <li className="ml-9">They change their minds after booking.</li>
              <li className="ml-9">
                They opt to handle the job or shipment themselves.
              </li>
              <li className="ml-9">{`They involve a third party in the job or shipment.`}</li>
              <li className="ml-9">
                {`The item doesn't match the job listing, hindering moving, cleaning, or delivery.`}
              </li>
              <li className="ml-9">
                {`They fail to provide the necessary delivery, removal, and cleaning information or documents.`}
              </li>
              <li className="ml-9">
                {`A third party cancels with the customer.`}
              </li>
              <li className="ml-9">
                {`They alter the removal, cleaning, or delivery dates, causing inconvenience to the driver.`}
              </li>
            </ul>

            <p className="pt-8">
              {`MovMonkey advises against using payment methods without dispute options. In fraudulent
                transactions, the non-offending party may receive a full refund of the MovMonkey booking
                payment after an initial investigation.`}
            </p>

            <p className="pt-8">
              If a job {`isn't`} completed, contact us at
              <span className="font-semibold"> support@movmonkey.com</span> with
              evidence of cancellation. Upon receiving the request, MovMonkey
              contacts the driver or service provider for confirmation within 3
              days. Refunds are processed only after the cancellation
              investigation, typically lasting up to 2 weeks.
            </p>

            <p className="pt-8">
              {`Refund requests must be made within 3 days of the full payment, and refunds are issued to the original payment method. MovMonkey reserves the right to issue refunds via PayPal in exceptional circumstances but cannot process refunds via personal checks.`}
            </p>

            <p className="pt-8">
              {`MovMonkey may temporarily suspend or permanently terminate a user's account for various
               reasons, including breaches of terms, identity verification issues, suspected fraudulent activities, or the discovery of prohibited items in a job. Such actions are taken at MovMonkey's sole discretion, with or without prior notice. Users can inform MovMonkey of any extenuating circumstances surrounding account suspension or termination, which may be considered in decision-making.`}
            </p>
          </div>
        </Container>
      </div>
      <div>
        <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-secondary px-5 py-2 text-center text-2xl font-semibold text-white md:h-20 md:text-2xl lg:mt-20">
          Cancelled Services Policy for Customers
        </div>
        <Container>
          <div className="space-y-2 px-5 text-xl leading-[45px] md:text-2xl">
            <p>
              {`MovMonkey acknowledges the fluid nature of our clients' schedules and the potential necessity of cancelling a job or shipment after a driver or service provider has been booked. In such instances, MovMonkey provides a framework to minimize inconvenience and financial impact on both the customer and the driver.`}
            </p>

            <p className="pt-8">
              {`If a job or shipment is cancelled no later than 72 hours before the scheduled delivery or job
                execution time, the customer is not obligated to pay a cancellation fee to the driver or service
                provider. Furthermore, should the cancellation result from the driver's failure to fulfil the
                agreed-upon terms, no fee is payable to the driver or service provider.`}
            </p>

            <p className="pt-8">
              {`It is essential to distinguish between the cancellation fee payable to the driver and the
                MovMonkey Magnum Fee incurred upon a driver's or service provider’s reservation. Distinct
                policies govern these fees. For information regarding the refund of the MovMonkey Magnum
                Fee, customers are advised to consult the specific refund policy provided by MovMonkey.`}
            </p>

            <p className="pt-8">
              {`For cancellations within 72 hours of the scheduled cleaning, removal, or delivery, a tiered
                cancellation fee structure is applied to compensate the driver or service provider for the time
                and resources already expended in preparation for the job.`}
            </p>

            <p className="pt-8">{`The fee schedule is as follows:`}</p>

            <ul className="list-disc pt-1 text-xl md:text-2xl">
              <li className="ml-9">
                Cancellation 48–72 hours before job execution incurs a £50 fee
                in the case of a United States $60 fee payable to the driver.
              </li>
              <li className="ml-9">
                Cancellation 24-48 hours before job execution incurs a £100 fee
                in the case of a United States $120 fee payable to the driver.
              </li>
              <li className="ml-9">{`Cancellation within 24 hours of job execution requires the greater of £100, or 60% in the case of a United States $100, or 60% of the full payment agreed to be paid to driver or service provider.`}</li>
            </ul>

            <p className="pt-8">
              {`Payment of cancellation fees can be made through previously agreed-upon methods of booking on the platform, including but not limited to PayPal or credit card. Customers should contact the MovMonkey support team for additional information on payment methods.`}
            </p>

            <p className="pt-8">
              {`When a bank transfer refund is not applicable, MovMonkey will issue a coupon code equivalent to the amount paid upon booking. For a one-time booking on MovMonkey's platform, the customer can use or share this code, which has no expiration date. `}
            </p>

            <p className="pt-8">
              {`In the event of a cancellation, the customer must initiate contact with MovMonkey through the email address associated with their account. Failure to do so will result in the forfeiture of the
               booking fee paid to MovMonkey. Upon initiating the cancellation process, customers are
               encouraged to provide all relevant information to assess eligibility for either a bank transfer
               refund or the issuance of a coupon code.`}
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}
