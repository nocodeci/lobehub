import { createStyles } from 'antd-style';

export const useDocStyles = createStyles(({ css }: { css: any }) => ({
    sectionBlock: css`
        margin-bottom: 64px;
    `,
    sectionTitle: css`
        font-size: 32px;
        font-weight: 900;
        margin-bottom: 8px;
        color: #000;
        display: flex;
        align-items: center;
        gap: 12px;
    `,
    sectionSubtitle: css`
        font-size: 16px;
        color: #666;
        margin-bottom: 32px;
        line-height: 1.6;
    `,
    h3: css`
        font-size: 22px;
        font-weight: 800;
        margin: 40px 0 12px;
        color: #111;
    `,
    h4: css`
        font-size: 17px;
        font-weight: 700;
        margin: 28px 0 8px;
        color: #222;
    `,
    prose: css`
        font-size: 15px;
        color: #444;
        line-height: 1.8;
        margin-bottom: 16px;
    `,
    codeBlock: css`
        background: #1e1e2e;
        color: #cdd6f4;
        border-radius: 12px;
        padding: 20px 24px;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 13px;
        line-height: 1.7;
        overflow-x: auto;
        margin: 16px 0 24px;
        white-space: pre-wrap;
    `,
    stepCard: css`
        display: flex;
        gap: 16px;
        padding: 20px;
        border: 1px solid rgba(0,0,0,0.06);
        border-radius: 16px;
        margin-bottom: 12px;
        transition: border-color 0.2s;
        &:hover { border-color: #075e54; }
    `,
    stepNumber: css`
        width: 36px;
        height: 36px;
        min-width: 36px;
        border-radius: 10px;
        background: #075e54;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 15px;
    `,
    featureGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin: 20px 0 32px;
    `,
    featureCard: css`
        border: 1px solid rgba(0,0,0,0.06);
        border-radius: 16px;
        padding: 24px;
        transition: all 0.2s;
        &:hover {
            border-color: #075e54;
            box-shadow: 0 8px 24px rgba(7, 94, 84, 0.06);
        }
    `,
    featureIcon: css`
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: rgba(7, 94, 84, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #075e54;
        margin-bottom: 12px;
    `,
    planTable: css`
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0 32px;
        th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            font-size: 14px;
        }
        th {
            font-weight: 700;
            color: #333;
            background: #fafbfc;
        }
        td { color: #555; }
        tr:hover td { background: rgba(7, 94, 84, 0.02); }
    `,
    list: css`
        padding-left: 20px;
        color: #444;
        line-height: 2;
        font-size: 15px;
    `,
    navFooter: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 64px;
        padding-top: 32px;
        border-top: 1px solid rgba(0,0,0,0.06);
        gap: 16px;
        flex-wrap: wrap;
    `,
    navLink: css`
        display: flex;
        align-items: center;
        gap: 8px;
        color: #075e54;
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
        padding: 10px 16px;
        border-radius: 10px;
        border: 1px solid rgba(7, 94, 84, 0.15);
        transition: all 0.2s;
        cursor: pointer;
        &:hover {
            background: rgba(7, 94, 84, 0.05);
            border-color: #075e54;
        }
    `,
}));
