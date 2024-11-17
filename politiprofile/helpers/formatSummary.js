function formatSummary(summary) {
    // Remove content inside <b> tags along with the tags
    const withoutBoldContent = summary.replace(/<b>.*?<\/b>/g, "");
    
    // Remove all other HTML tags and trim whitespace
    const formattedSummary = withoutBoldContent
        .replace(/<\/?[^>]+(>|$)/g, "")
        .trim();

    return formattedSummary;
}

export default formatSummary;
