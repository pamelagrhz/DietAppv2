import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import helpContent from '../data/Help-es.json';
import './Help.css';

export default function Help() {
  return (
    <main className="help-page">
      <header className="help-header">
        <p className="help-kicker">Manual de usuario</p>
        <h1 className="help-title">{helpContent.title}</h1>
        <p className="help-subtitle">{helpContent.subtitle}</p>
        <p className="help-intro">{helpContent.intro}</p>
      </header>

      <section className="help-accordion-list">
        {helpContent.sections.map((section) => (
          <Accordion key={section.title} className="help-accordion" disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <span className="help-accordion-title">{section.title}</span>
            </AccordionSummary>
            <AccordionDetails>
              <div className="help-accordion-content">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </section>
    </main>
  );
}
