import React from 'react';

const companies = [
  { name: 'Elevate Tech', logo: 'https://media.licdn.com/dms/image/v2/D560BAQFFvoobar7g0w/company-logo_200_200/B56Z2WJ2WwIYAI-/0/1776340659574/elevate_tech_india_pvt_ltd_logo?e=2147483647&v=beta&t=2UfEsQLAllYckK8A16oraDqm1-VAcmK1FO8vvvhnIDE' },
  { name: 'RedPeak Solutions', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8ao-tErXIs4_156e23tl4u48n7hrCjt3uRw&s' },
  { name: 'Nova Labs', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH9CQ7grzCnp22JU502KJHEU8V8nQpOqptQQ&s' },
  { name: 'PivotWorks', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdayKPDZR3NE8cHH9hNDQJneZE4T8XUhPegA&s' },
  { name: 'Summit Health', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROGfE-GvrF8hiAWc3_gPvb1aSN3GgwC6-duQ&s' },
  { name: 'CodaEdge', logo: 'https://www.codedgeacademy.com/logoheader.png' },
];

export default function LogoSlider() {
  return (
    <section className="bg-white dark:bg-slate-950 py-12">
      <div className="page-container">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary-600">Trusted by leading teams</p>
          <h2 className="mt-4 text-3xl font-display font-bold text-slate-900 dark:text-slate-100">We provide services to businesses across diverse industries</h2>
        </div>

        <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 dark:border-slate-800 shadow-soft bg-slate-50 dark:bg-slate-900/40">
          <div className="logo-scroll px-6 py-5">
            {companies.concat(companies).map((company, index) => (
              <div key={`${company.name}-${index}`} className="flex h-20 w-40 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 shadow-card transition duration-300 hover:shadow-hover">
                <img src={company.logo} alt={company.name} className="h-12 object-contain" />
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </section>
  );
}
