import jsPDF from 'jspdf';

export const exportRecipeToPDF = (recipe) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    if (isBold) {
      doc.setFont(undefined, 'bold');
    } else {
      doc.setFont(undefined, 'normal');
    }
    
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      if (yPosition > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    yPosition += 5;
  };

  // Title
  addText(recipe.title, 24, true, [255, 102, 0]);
  yPosition += 5;

  // Cuisine and Difficulty
  addText(`${recipe.cuisine} • ${recipe.difficulty}`, 12, false, [100, 100, 100]);
  yPosition += 5;

  // Description
  addText(recipe.description, 12);
  yPosition += 10;

  // Recipe Info
  const infoText = `Prep: ${recipe.prepTime} min | Cook: ${recipe.cookTime} min | Servings: ${recipe.servings}`;
  addText(infoText, 11, false, [100, 100, 100]);
  yPosition += 10;

  // Rating
  if (recipe.rating) {
    const stars = '⭐'.repeat(recipe.rating);
    addText(`Rating: ${stars} (${recipe.rating}/5)`, 11);
    yPosition += 10;
  }

  // Tags
  if (recipe.tags && recipe.tags.length > 0) {
    addText(`Tags: ${recipe.tags.join(', ')}`, 10, false, [100, 100, 100]);
    yPosition += 10;
  }

  yPosition += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Ingredients
  addText('INGREDIENTS', 16, true, [255, 102, 0]);
  yPosition += 5;
  recipe.ingredients.forEach((ingredient) => {
    addText(`• ${ingredient}`, 11);
  });
  yPosition += 10;

  // Instructions
  addText('INSTRUCTIONS', 16, true, [255, 102, 0]);
  yPosition += 5;
  recipe.instructions.forEach((instruction, index) => {
    addText(`${index + 1}. ${instruction}`, 11);
    yPosition += 3;
  });

  // Save PDF
  const fileName = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
  doc.save(fileName);
};

